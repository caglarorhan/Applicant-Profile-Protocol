import express from 'express';
import { 
  getProfile, 
  listProfiles, 
  updateProfile, 
  deleteProfile 
} from '../controllers/profile.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * GET /api/profiles
 * List all profiles for authenticated user
 */
router.get('/', authenticateUser, listProfiles);

/**
 * GET /api/profiles/:id
 * Get single profile by ID
 */
router.get('/:id', authenticateUser, getProfile);

/**
 * PUT /api/profiles/:id
 * Update profile
 */
router.put('/:id', authenticateUser, updateProfile);

/**
 * DELETE /api/profiles/:id
 * Delete profile
 */
router.delete('/:id', authenticateUser, deleteProfile);

export default router;
