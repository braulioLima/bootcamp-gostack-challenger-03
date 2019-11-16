import { Router } from 'express';

import UserController from './app/controllers/UserController';

import StudentController from './app/controllers/StudentController';

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

// Students routes

routes.post('/students', StudentController.store);

routes.put('/students', StudentController.update);

export default routes;
