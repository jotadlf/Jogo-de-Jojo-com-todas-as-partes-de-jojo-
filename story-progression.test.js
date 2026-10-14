import test from 'node:test';
import assert from 'node:assert/strict';
import { campaigns, getCampaign } from './campaigns.js';
import {
  SAVE_DEFAULT,
  STORY_PHASES,
  completeStage,
  finishStage,
  normalizeSave,
  recordBattleVictory,
  recordDialogue,
  recordEnvironmentChange,
  recordObjective,
  transitionPhase,
  unlockCampaignAfterCompletion,
} from './story-progression.js';

function completeCampaign(save, campaign) {
  const progress = save.story.campaigns[campaign.id];
  for (const stage of campaign.stages) {
    assert.equal(progress.phase, STORY_PHASES.INTRO);
    assert.equal(transitionPhase(progress, STORY_PHASES.EXPLORATION, `intro:${stage.id}`), true);
    assert.equal(transitionPhase(progress, STORY_PHASES.OBJECTIVE_ACTIVE, `explore:${stage.id}`), true);
    assert.equal(recordObjective(progress, stage.objective.id), true);
    assert.equal(transitionPhase(progress, STORY_PHASES.ENEMY_ENCOUNTER, `encounter:${stage.id}`), true);
    assert.equal(transitionPhase(progress, STORY_PHASES.BOSS_FIGHT, `fight:${stage.id}`), true);
    assert.equal(recordBattleVictory(progress, stage, stage.enemies.map((enemy) => enemy.id)), true);
    assert.equal(recordDialogue(progress, `${stage.id}:victory`), true);
    assert.equal(transitionPhase(progress, STORY_PHASES.ENVIRONMENT_CHANGED, `post:${stage.id}`), true);
    assert.equal(recordEnvironmentChange(progress, stage), true);
    assert.equal(finishStage(progress, stage), true);
    assert.equal(completeStage(progress, campaign), true);
  }
  unlockCampaignAfterCompletion(save, campaign, campaigns);
}

test('cada um dos nove protagonistas possui fases estáveis com objetivos e chefes próprios', () => {
  assert.equal(campaigns.length, 9);
  assert.equal(new Set(campaigns.map((campaign) => campaign.id)).size, 9);
  for (const campaign of campaigns) {
    assert.ok(campaign.stages.length >= 4, `${campaign.id} precisa de várias fases`);
    assert.equal(new Set(campaign.stages.map((stage) => stage.id)).size, campaign.stages.length);
    for (const stage of campaign.stages) {
      assert.ok(stage.objective.id && stage.pathId && stage.dialogue.intro);
      assert.ok(stage.enemies.length > 0 && stage.enemies.every((enemy) => enemy.id && enemy.pattern));
    }
  }
});

test('a máquina não pula estados nem aceita vitória de inimigo fora do confronto atual', () => {
  const save = normalizeSave(SAVE_DEFAULT, campaigns);
  const campaign = getCampaign('jonathan');
  const progress = save.story.campaigns.jonathan;
  const stage = campaign.stages[0];

  assert.equal(transitionPhase(progress, STORY_PHASES.BOSS_FIGHT, 'pular-intro'), false);
  assert.equal(recordBattleVictory(progress, stage, stage.enemies.map((enemy) => enemy.id)), false);
  assert.equal(transitionPhase(progress, STORY_PHASES.EXPLORATION, 'intro'), true);
  assert.equal(transitionPhase(progress, STORY_PHASES.OBJECTIVE_ACTIVE, 'explore'), true);
  assert.equal(recordObjective(progress, stage.objective.id), true);
  assert.equal(transitionPhase(progress, STORY_PHASES.ENEMY_ENCOUNTER, 'encounter'), true);
  assert.equal(transitionPhase(progress, STORY_PHASES.BOSS_FIGHT, 'fight'), true);
  assert.equal(recordBattleVictory(progress, stage, ['unrelated-enemy']), false);
  assert.equal(progress.phase, STORY_PHASES.BOSS_FIGHT);
});

test('vitória, caminho aberto e diálogos são registrados uma única vez', () => {
  const save = normalizeSave(SAVE_DEFAULT, campaigns);
  const campaign = getCampaign('jonathan');
  const progress = save.story.campaigns.jonathan;
  const stage = campaign.stages[0];
  for (const [phase, key] of [[STORY_PHASES.EXPLORATION, 'i'], [STORY_PHASES.OBJECTIVE_ACTIVE, 'e'], [STORY_PHASES.ENEMY_ENCOUNTER, 'o'], [STORY_PHASES.BOSS_FIGHT, 'b']]) assert.equal(transitionPhase(progress, phase, key), true);

  assert.equal(recordBattleVictory(progress, stage, stage.enemies.map((enemy) => enemy.id)), true);
  assert.equal(recordBattleVictory(progress, stage, stage.enemies.map((enemy) => enemy.id)), false);
  assert.equal(progress.defeatedEnemyIds.length, stage.enemies.length);
  assert.equal(recordDialogue(progress, 'p1:after'), true);
  assert.equal(recordDialogue(progress, 'p1:after'), false);
  assert.equal(transitionPhase(progress, STORY_PHASES.ENVIRONMENT_CHANGED, 'post'), true);
  assert.equal(recordEnvironmentChange(progress, stage), true);
  assert.equal(recordEnvironmentChange(progress, stage), false);
  assert.ok(progress.unlockedPathIds.includes(stage.pathId));
});

test('save antigo é migrado e conserva habilidades desbloqueadas', () => {
  const save = normalizeSave({ advanced: ['jotaro'], victories: ['jotaro'] }, campaigns);
  assert.deepEqual(save.advanced, ['jotaro']);
  assert.deepEqual(save.victories, ['jotaro']);
  assert.deepEqual(save.story.unlockedCampaignIds, ['jonathan']);
  assert.equal(save.story.campaigns.jonathan.phase, STORY_PHASES.INTRO);
  assert.equal(save.story.secretUnlocked, false);
});

test('campanhas abrem a seguinte em ordem e só liberam a história secreta ao concluir as nove', () => {
  const save = normalizeSave(SAVE_DEFAULT, campaigns);
  for (const campaign of campaigns.slice(0, -1)) {
    assert.ok(save.story.unlockedCampaignIds.includes(campaign.id));
    completeCampaign(save, campaign);
    assert.equal(save.story.secretUnlocked, false);
  }
  assert.equal(save.story.unlockedCampaignIds.includes('jodio'), true);
  completeCampaign(save, campaigns.at(-1));
  assert.equal(save.story.secretUnlocked, true);
  assert.equal(campaigns.at(-1).openEnded, true);
  assert.equal(campaigns.at(-1).stages.at(-1).openEndedChapter, true);
});