import { Router } from 'express';
const router = Router();
import { getUsers, getSingleUser } from '../../controllers/userController.js';

// /api/users
router.route('/').get(getUsers);

// /api/users/:userId
router.route('/:userId').get(getSingleUser);

export default router;