import { Router } from 'express';
import { decodeFirebaseToken } from '../middlewares/decodeFirebaseToken';
import * as authController from '../controllers/auth.controller'

const router = Router();

router.post('/sync', decodeFirebaseToken, authController.syncUser);

export default router;