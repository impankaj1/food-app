import { Request, Response, Router } from 'express';
import AuthController from '../controllers/AuthController';
import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router: Router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/refresh', authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'hello there',
  });
});

export default router;
