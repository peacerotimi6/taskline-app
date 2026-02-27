import { GAME_CONFIG } from "./config.js";
import { applyPowerUp, isShieldActive, pickPowerUpType } from "./powerups.js";

const rr = (a, b) => Math.random() * (b - a) + a;
const mk = (s, r) => ({ x: rr(r, GAME_CONFIG.width - r), y: -r, radius: r, speed: rr(GAME_CONFIG.fallSpeedMin, GAME_CONFIG.fallSpeedMax) * (s.difficulty || 1) });
const ov = (c, p) => { const nx = Math.max(p.x, Math.min(c.x, p.x + p.width)); const ny = Math.max(p.y, Math.min(c.y, p.y + p.height)); const dx = c.x - nx, dy = c.y - ny; return dx * dx + dy * dy <= c.radius * c.radius; };
const mv = (list, dt) => { for (const i of list) i.y += i.speed * dt; };

export const spawnStar = (s) => s.stars.push({ ...mk(s, GAME_CONFIG.starRadius), kind: Math.random() < 0.14 ? "gold" : "normal" });
export const spawnBomb = (s) => s.bombs.push(mk(s, GAME_CONFIG.bombRadius));
export const spawnPowerUp = (s) => s.powerUps.push({ ...mk(s, GAME_CONFIG.powerUpRadius), type: pickPowerUpType() });
export const spawnBossTarget = (s) => { s.boss.target = { x: rr(30, GAME_CONFIG.width - 30), y: -22, radius: 20, speed: 140 }; };

export function updateEntities(state, dt) {
  let starHits = 0, goldHits = 0, bombHits = 0, powerHits = 0, bossHits = 0;
  mv(state.stars, dt); mv(state.bombs, dt); mv(state.powerUps, dt);
  state.stars = state.stars.filter((v) => { if (ov(v, state.player)) { if (v.kind === "gold") { state.metrics.goldStars += 1; goldHits += 1; } else { state.metrics.stars += 1; starHits += 1; } return false; } return v.y - v.radius <= GAME_CONFIG.height; });
  state.bombs = state.bombs.filter((v) => { if (ov(v, state.player)) { if (!isShieldActive(state) && state.effects.hitGraceSecondsLeft <= 0) { state.lives -= 1; state.metrics.bombsHit += 1; bombHits += 1; state.effects.hitGraceSecondsLeft = 1.2; } return false; } return v.y - v.radius <= GAME_CONFIG.height; });
  state.powerUps = state.powerUps.filter((v) => { if (ov(v, state.player)) { applyPowerUp(state, v.type); state.metrics.powerUps += 1; powerHits += 1; return false; } return v.y - v.radius <= GAME_CONFIG.height; });
  if (state.boss.target) {
    state.boss.target.y += state.boss.target.speed * dt;
    if (ov(state.boss.target, state.player)) { bossHits += 1; state.boss.target = null; }
    else if (state.boss.target.y - state.boss.target.radius > GAME_CONFIG.height) state.boss.target = null;
  }
  return { starHits, goldHits, bombHits, powerHits, bossHits };
}
