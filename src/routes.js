import { Router } from 'express';

import AnswerOrderController from './app/controllers/AnswerOrderController';
import ChekinController from './app/controllers/ChekinController';
import HelpOrderController from './app/controllers/HelpOrderController';
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

// Help orders to students
routes.post('/students/:id/help-orders', HelpOrderController.store);

routes.get('/students/:id/help-orders', HelpOrderController.index);

/**
 * Route to store a user
 */
routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Answer a help order
routes.post('/help-orders/:id/answer', AnswerOrderController.store);

routes.get('/help-orders', AnswerOrderController.index);

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
