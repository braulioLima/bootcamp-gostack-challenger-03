import { Router } from 'express';

import UserController from './app/controllers/UserController';

import SessionController from './app/controllers/SessionController';

import authMiddleware from './middlewares/auth';

const routes = new Router();

/**
 * Route to store a user
 */
routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
