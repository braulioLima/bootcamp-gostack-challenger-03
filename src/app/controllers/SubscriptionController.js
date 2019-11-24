import 'dotenv/config';

import { Op } from 'sequelize';

import * as Yup from 'yup';

import { addMonths, parseISO, format, isBefore } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Queue from '../../lib/Queue';
import ConfirmationMail from '../jobs/ConfirmationMail';

import Subscription from '../models/Subscription';
import Plan from '../models/Plan';
import Student from '../models/Student';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Verify if exist student with this id
     */
    const isStudent = await Student.findByPk(student_id);

    if (!isStudent) {
      return res.status(400).json({
        error: 'Student does not exist',
      });
    }

    /**
     * Verify if the plain exist
     */
    const isPlan = await Plan.findByPk(plan_id);

    if (!isPlan) {
      return res.status(400).json({ error: 'The plan does not exist' });
    }

    const isoStartDate = parseISO(start_date);

    const today = new Date();

    /**
     * Check if the start date is invalid
     */
    if (isBefore(isoStartDate, today)) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    /**
     * Check if the subscription already exist
     */
    const isSubscription = await Subscription.findOne({
      attributes: ['id'],
      where: {
        student_id,
        end_date: {
          [Op.gte]: start_date,
        },
      },
    });

    if (isSubscription) {
      return res
        .status(400)
        .json({ error: 'This student already Subscription active.' });
    }

    /**
     * Calculate total price
     */
    const { duration, price: monthPrice } = isPlan;

    const price = duration * monthPrice;

    /**
     * Set end date based in start date
     */
    const end_date = addMonths(isoStartDate, duration);

    /**
     * Make te store a Subscription
     */
    await Subscription.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const dateStringFormat = "'dia' dd 'de' MMMM', às' H:mm'h";
    /**
     * Format start and end date
     */
    const startDateFormated = format(isoStartDate, dateStringFormat, {
      locale: ptBR,
    });

    const endDateFormated = format(end_date, dateStringFormat, {
      locale: ptBR,
    });

    const emailData = {
      name: isStudent.name,
      email: isStudent.email,
      startDate: startDateFormated,
      duration,
      endDate: endDateFormated,
      total: price,
    };

    /**
     * Make send mail
     */
    await Queue.add(ConfirmationMail.key, emailData);

    /**
     * Return the vizualization store data.
     */
    return res.status(201).json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const subscriptions = await Subscription.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      limit: process.env.APP_PAGE_SIZE,
      offset: (page - 1) * process.env.APP_PAGE_SIZE,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    return res.json(subscriptions);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    const isValidID = Yup.number()
      .integer()
      .positive();

    if (!(await isValidID.isValid(req.params.id))) {
      return res.status(400).json({ error: "Invalid Subscription'id format" });
    }

    const isSubscription = await Subscription.findByPk(req.params.id);

    if (!isSubscription) {
      return res.status(400).json({ error: 'Subscription not exist' });
    }

    await isSubscription.destroy();

    return res.json();
  }
}

export default new SubscriptionController();
