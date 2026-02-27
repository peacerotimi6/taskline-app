import { GAME_CONFIG } from "./config.js";

const STEP = 120;

function levelForScore(score) {
  return 1 + Math.floor(score / STEP);
}

function difficultyForLevel(level) {
  return 1 + (level - 1) * 0.14;
}

export function tickProgression(state) {
  state.level = Math.min(GAME_CONFIG.maxLevel, levelForScore(state.score));
  state.difficulty = difficultyForLevel(state.level);
}

export function intervalFor(base, difficulty) {
  return base / Math.min(2.8, difficulty);
}
