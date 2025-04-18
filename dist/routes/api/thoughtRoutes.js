import { Router } from 'express';
const router = Router();
import { getThoughts, getSingleThought, postThought, putThought, deleteThought, postReaction, deleteReaction } from '../../controllers/thoughtController.js';
// /api/thoughts
router.route('/').get(getThoughts).post(postThought);
// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getSingleThought).put(putThought).delete(deleteThought);
router.route('/:thoughtId/reactions').post(postReaction).delete(deleteReaction);
export default router;
