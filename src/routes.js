import { Router } from 'express';

import ChekinController from './app/controllers/ChekinController';
import PlanController from './app/controllers/PlanController';
import SessionController from './app/controllers/SessionController';
import SubscriptionController from './app/controllers/SubscriptionController';
import StudentController from './app/controllers/StudentController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Chekin's routes
routes.post('/students/:id/checkins', ChekinController.store);
routes.get('/students/:id/checkins', ChekinController.index);

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

// Plan's routes

routes.post('/plans', PlanController.store);

routes.get('/plans', PlanController.index);

routes.put('/plans/:id', PlanController.update);

routes.delete('/plans/:id', PlanController.delete);

// Subscription's routes

routes.post('/subscriptions', SubscriptionController.store);

routes.get('/subscriptions', SubscriptionController.index);

routes.put('/subscriptions/:id', SubscriptionController.update);

routes.delete('/subscriptions/:id', SubscriptionController.delete);

export default routes;
