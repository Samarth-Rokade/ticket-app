import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/userAuth.middleware.js';

const router = express.Router();

// Get all reviews
router.get('/', reviewController.getReviews);

// Get a single review by ID
router.get('/get-review', reviewController.getReviewById);

// Create a new review
router.post('/create', verifyJWT, reviewController.createReview);

// Delete a review by ID
router.delete('/delete',verifyJWT, reviewController.deleteReview);

export default router;