import { GAME_CONFIG } from "./config.js";

export const POWER_UP_TYPES = { SHIELD: "shield", FREEZE: "freeze", RUSH: "rush" };

export function pickPowerUpType() {
  const n = Math.random();
  if (n < 0.45) return POWER_UP_TYPES.SHIELD;
  if (n < 0.77) return POWER_UP_TYPES.FREEZE;
  return POWER_UP_TYPES.RUSH;
}

export function applyPowerUp(state, type) {
  if (type === POWER_UP_TYPES.SHIELD) state.effects.shieldSecondsLeft = GAME_CONFIG.shieldDurationSeconds;
  if (type === POWER_UP_TYPES.FREEZE) state.effects.freezeSecondsLeft = 5;
  if (type === POWER_UP_TYPES.RUSH) state.effects.feverSecondsLeft = Math.max(state.effects.feverSecondsLeft, 5);
}

export function tickPowerUpEffects(state, dt) {
  state.effects.shieldSecondsLeft = Math.max(0, state.effects.shieldSecondsLeft - dt);
  state.effects.freezeSecondsLeft = Math.max(0, state.effects.freezeSecondsLeft - dt);
}

export function isShieldActive(state) { return state.effects.shieldSecondsLeft > 0; }
export function isFreezeActive(state) { return state.effects.freezeSecondsLeft > 0; }

export function getPowerUpLabel(state) {
  if (state.effects.freezeSecondsLeft > 0) return `Freeze (${Math.ceil(state.effects.freezeSecondsLeft)}s)`;
  if (state.effects.shieldSecondsLeft > 0) return `Shield (${Math.ceil(state.effects.shieldSecondsLeft)}s)`;
  if (state.effects.feverSecondsLeft > 0) return "Rush";
  return "None";
}

export function getPowerUpColor(type) {
  if (type === POWER_UP_TYPES.FREEZE) return "#72c3f0";
  if (type === POWER_UP_TYPES.RUSH) return "#f0b85b";
  return "#58d2a8";
}
