import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

/**
 * Route to store a user
 */
routes.post('/users', UserController.store);

export default routes;
