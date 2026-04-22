import 'dotenv/config';
import app from './app.js';
import { startCleanupJob } from './services/cleanup.service.js';

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API listening on ${port}`);
  startCleanupJob();
});
