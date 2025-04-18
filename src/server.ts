import express from 'express';
import db from './config/connection.js';
import routes from './routes/index.js';

import './models/Thought.js';  // Registers the Thought model globally
import './models/User.js';     // Registers the User model

const cwd = process.cwd();

const PORT = 3001;
const app = express();

// Note: not necessary for the Express server to function. This just helps indicate what activity's server is running in the terminal.
const activity = cwd.includes('socnet-api')
  ? cwd.split('socnet-api')[1]
  : cwd;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server for ${activity} running on port ${PORT}!`);
  });
});
