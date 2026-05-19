// server.mjs — Zen-Gamer Backend API Entry Point
import app from './api/index.mjs';

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`✓ Zen-Gamer Backend API running on http://localhost:${PORT}`);
});
