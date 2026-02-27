import { GAME_CONFIG } from "./config.js";
import { getPowerUpColor, isShieldActive } from "./powerups.js";

export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  function clear() {
    ctx.clearRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
  }

  function drawPlayer(player, shieldActive) {
    ctx.fillStyle = "#f2a450";
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.width, player.height, 8);
    ctx.fill();
    ctx.fillStyle = "#ffd9a8";
    ctx.fillRect(player.x + 8, player.y + 3, player.width - 16, 3);

    if (shieldActive) {
      ctx.strokeStyle = "#59d9ac";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(player.x - 4, player.y - 4, player.width + 8, player.height + 8, 10);
      ctx.stroke();
    }
  }

  function drawCircle(entity, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGameOver(state) {
    ctx.fillStyle = "rgba(53, 109, 179, 0.34)";
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 34px Segoe UI";
    const title = state.result === "victory" ? "Victory" : state.result === "won" ? "Session Complete" : state.result === "aborted" ? "Run Aborted" : "Game Over";
    ctx.fillText(title, GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 - 18);
    ctx.font = "20px Segoe UI";
    ctx.fillText(`Final Score: ${state.score}`, GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 20);
  }

  function drawPause() {
    ctx.fillStyle = "rgba(67, 79, 94, 0.3)";
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 30px Segoe UI";
    ctx.fillText("Paused", GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 8);
  }

  return {
    render(state) {
      clear();
      drawPlayer(state.player, isShieldActive(state));
      state.stars.forEach((star) => drawCircle(star, star.kind === "gold" ? "#f5b64c" : "#77ddff"));
      state.bombs.forEach((bomb) => drawCircle(bomb, "#ff6262"));
      state.powerUps.forEach((powerUp) => drawCircle(powerUp, getPowerUpColor(powerUp.type)));
      if (state.boss.target) drawCircle(state.boss.target, "#d96bff");
      if (state.effects.feverSecondsLeft > 0) {
        ctx.fillStyle = "rgba(245, 182, 76, 0.08)";
        ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
      }
      if (state.effects.freezeSecondsLeft > 0) {
        ctx.fillStyle = "rgba(110, 179, 247, 0.09)";
        ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
      }
      if (state.boss.active) {
        ctx.fillStyle = "rgba(217, 107, 255, 0.08)";
        ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
      }

      if (state.isGameOver) {
        drawGameOver(state);
      }
      if (state.isPaused && !state.isGameOver) {
        drawPause();
      }
    },
  };
}
