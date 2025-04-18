import { Router } from 'express';
const router = Router();
import { 
    getUsers, 
    getSingleUser, 
    postUser, 
    putUser, 
    deleteUser, 
    postFriend, 
    deleteFriend
} from '../../controllers/userController.js';

// /api/users
router.route('/').get(getUsers).post(postUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).put(putUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(postFriend).delete(deleteFriend);

export default router;