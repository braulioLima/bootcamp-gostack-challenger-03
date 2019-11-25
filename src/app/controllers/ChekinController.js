import * as Yup from 'yup';

import { Op, Sequelize } from 'sequelize';
import { subHours, subDays } from 'date-fns';

import { addDays } from 'date-fns/fp';
import Chekin from '../models/Chekin';
import Student from '../models/Student';
import Subscription from '../models/Subscription';

class CheckinController {
  async index(req, res) {
    /**
     * Check if route param id is in valid format
     */
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
      page: Yup.number()
        .integer()
        .positive(),
    });

    /**
     * Validate route and query params format
     */
    const { id } = req.params;

    const { page = 1 } = req.query;

    if (!(await schema.isValid({ id, page }))) {
      return res.status(401).json({ error: 'Validation Fails' });
    }

    /**
     * Verify if student exist
     */
    if (!(await Student.findByPk(id))) {
      return res.status(400).json({ error: 'Invalid student' });
    }

    /**
     * Return all checkins with desc order of one student
     */
    const checkins = await Chekin.findAll({
      attributes: ['id', ['created_at', 'hour'], 'student_id'],
      where: { student_id: id },
      limit: process.env.APP_PAGE_SIZE,
      offset: (page - 1) * process.env.APP_PAGE_SIZE,
      include: [
        {
          model: Student,
          as: 'student_data',
          attributes: ['name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json({ data: checkins, page });
  }

  async store(req, res) {
    const checkId = Yup.number()
      .integer()
      .positive()
      .required();

    const { id } = req.params;
    if (!(await checkId.isValid(id))) {
      return res.status(401).json({ error: 'Invalid id' });
    }

    if (!(await Student.findByPk(id))) {
      return res.status(400).json({ error: 'Invalid student' });
    }

    const today = subHours(new Date(), 3);

    const isSubscription = await Subscription.findOne({
      where: {
        student_id: id,
        end_date: {
          [Op.lt]: today,
        },
      },
    });

    if (isSubscription) {
      return res
        .status(401)
        .json({ error: 'User not have active subscription' });
    }

    const diffDate = subDays(today, 7);

    let { count } = await Chekin.findAndCountAll({
      attributes: ['student_id'],
      where: {
        student_id: id,
        created_at: {
          [Op.gte]: diffDate,
        },
      },
    });

    count += 1;

    if (count > 5) {
      return res
        .status(401)
        .json({ error: "Exceded chekin's limit of 5 in 7 days" });
    }

    const { student_id } = await Chekin.create({ student_id: id });

    return res.status(201).json({ student_id, count });
  }
}

export default new CheckinController();
