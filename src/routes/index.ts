import { Router } from 'express';
import apiRoutes from './api/index.js';


const router = Router();

// Attach routes defined in the api folder to /api
router.use('/api', apiRoutes);

router.use((_req, res) => {
  return res.send('Wrong route!');
});

export default router;