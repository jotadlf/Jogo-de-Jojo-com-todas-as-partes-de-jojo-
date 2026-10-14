const ROLE_DIRECTORIES = Object.freeze({
  protagonist: 'Protagonista',
  finalBoss: 'Chefe-Final',
  antagonist: 'Boss-Secundário',
  ally: 'Aliados-do-Protagonista',
  secretBoss: 'Chefe-Secreto',
});

const fileUrls = import.meta.glob('./Jojo-Sprite/**/*.{jpeg,jpg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const normalize = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .replace(/[^a-z0-9]/g, '');

const aliases = Object.freeze({
  jonathan: ['Jonathan Joestar'],
  joseph: ['Joseph Joestar'],
  jotaro: ['Jotaro Kujo', 'JotaroAnime3'],
  josuke4: ['Josuke Higashikata', 'Josuke'],
  giorno: ['Giorno Giovanna'],
  jolyne: ['Jolyne Cujoh'],
  johnny: ['Johnny Joestar', 'Johnny_anime_png'],
  gappy: ['Josuke Higashikata (Gappy)', 'Gappy'],
  jodio: ['Jodio Joestar'],
  'will a. zeppeli': ['Wii A Zeppiin', 'Will A Zeppeli'],
  'diego brando alternativo': ['Diego Brando', 'Diego'],
  'yoshikage kira': ['Yoshikage Kira', 'Kira'],
  'dio brando': ['Dio Brando', 'Dio'],
  'noriaki kakyoin': ['Noriaki Kakyoin', 'Kakyoin'],
  'jean pierre polnareff': ['Jean Pierre Polnareff', 'Polnareff'],
  'wonder of u': ['Wonder Of You + Toru', 'Wonder Of You', 'Tooru', 'Toru'],
  tooru: ['Tooru', 'Toru', 'Wonder Of You + Toru'],
  'dio over heaven': ['Dio Over Heaven'],
});
const normalizedAliases = new Map(Object.entries(aliases).map(([name, candidates]) => [normalize(name), candidates]));

export const spriteAssets = Object.freeze(Object.entries(fileUrls)
  .map(([path, url]) => {
    const fileName = path.split('/').at(-1);
    const directory = path.split('/').at(-2);
    const name = fileName.replace(/\.[^.]+$/, '');
    return {
      key: `character-${normalize(directory)}-${normalize(name)}`,
      url,
      path,
      directory,
      name,
      normalizedName: normalize(name),
      comparableName: normalize(name).replace(/\d+$/, ''),
    };
  })
  .sort((first, second) => first.path.localeCompare(second.path)));

export function resolveSpriteAsset(role, ...names) {
  const directory = ROLE_DIRECTORIES[role];
  if (!directory) return null;
  const requested = names.flat(Infinity).filter(Boolean);
  const normalizedNames = new Set();

  for (const name of requested) {
    const normalized = normalize(name);
    if (!normalized) continue;
    normalizedNames.add(normalized);
    for (const token of String(name).split(/[^\p{L}\p{N}]+/u)) {
      const normalizedToken = normalize(token);
      if (normalizedToken.length > 2) normalizedNames.add(normalizedToken);
    }
    for (const alias of normalizedAliases.get(normalized) || []) normalizedNames.add(normalize(alias));
  }

  if (normalizedNames.size === 0) return null;
  const matches = spriteAssets.filter((asset) => asset.directory === directory)
    .map((asset) => {
      let score = 0;
      for (const candidate of normalizedNames) {
        if (candidate === asset.normalizedName) score = Math.max(score, 120);
        else if (candidate === asset.comparableName) score = Math.max(score, 116);
        else if (asset.normalizedName.startsWith(candidate)) score = Math.max(score, 100 - asset.normalizedName.length + candidate.length);
        else if (asset.comparableName.startsWith(candidate)) score = Math.max(score, 98 - asset.comparableName.length + candidate.length);
        else if (candidate.startsWith(asset.comparableName)) score = Math.max(score, 80);
        else if (asset.normalizedName.includes(candidate)) score = Math.max(score, 65);
      }
      return { asset, score };
    })
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score || first.asset.path.localeCompare(second.asset.path));

  return matches[0]?.asset || null;
}

export function characterSprite(character) {
  return resolveSpriteAsset('protagonist', character.id, character.short, character.name);
}

export function allySprite(character) {
  return resolveSpriteAsset('ally', character.id, character.name, character.short);
}

export function prepareSpriteImage(image, maxWidth = 256, maxHeight = 384) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const ratio = Math.min(maxWidth / sourceWidth, maxHeight / sourceHeight, 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sourceWidth * ratio));
  canvas.height = Math.max(1, Math.round(sourceHeight * ratio));
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = pixels;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let read = 0;
  let write = 0;
  const isLightBackground = (index) => {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    return data[index + 3] > 0 && Math.min(red, green, blue) > 224 && Math.max(red, green, blue) - Math.min(red, green, blue) < 28;
  };
  const enqueue = (pixel) => {
    if (visited[pixel] || !isLightBackground(pixel * 4)) return;
    visited[pixel] = 1;
    queue[write] = pixel;
    write += 1;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (read < write) {
    const pixel = queue[read];
    read += 1;
    data[pixel * 4 + 3] = 0;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - width);
    if (y < height - 1) enqueue(pixel + width);
  }

  context.putImageData(pixels, 0, 0);
  return canvas;
}

function imageMimeType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  if (String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return 'application/octet-stream';
}

export async function loadSpriteImages(requestedAssets = spriteAssets, onProgress = () => {}) {
  const assets = [...new Map(requestedAssets.filter(Boolean).map((asset) => [asset.key, asset])).values()];
  const prepared = new Map();
  const queue = [...assets];
  let completed = 0;
  const loadNext = async () => {
    while (queue.length) {
      const asset = queue.shift();
      let objectUrl;
      try {
        const response = await fetch(asset.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const bytes = await response.arrayBuffer();
        const blob = new Blob([bytes], { type: imageMimeType(new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 12))) });
        objectUrl = URL.createObjectURL(blob);
        const image = new Image();
        image.decoding = 'async';
        image.src = objectUrl;
        await image.decode();
        prepared.set(asset.key, prepareSpriteImage(image));
      } catch (error) {
        console.warn(`Sprite indisponível, usando fallback: ${asset.path}`, error);
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        completed += 1;
        onProgress(completed, assets.length);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(2, assets.length) }, () => loadNext()));
  return prepared;
}
