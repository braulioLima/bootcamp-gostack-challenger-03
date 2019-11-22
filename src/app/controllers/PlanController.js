import * as Yup from 'yup';

import User from '../models/User';
import Plan from '../models/Plan';

class PlanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
      price: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { title } = req.body;

    const isPlan = await Plan.findOne({ where: { title } });

    if (isPlan) {
      return res
        .status(400)
        .json({ error: 'Already exist one plan with this name' });
    }

    const { duration, price } = await Plan.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['duration'],
    });

    return res.json(plans);
  }

  async update(req, res) {
    const checkID = Yup.number()
      .integer()
      .positive()
      .required();

    if (!(await checkID.isValid(req.params.id))) {
      return res.status(400).json({ error: 'Plan id in invalid format' });
    }

    const isPlan = await Plan.findByPk(req.params.id);

    if (!isPlan) {
      return res.status(400).json({ error: 'Not exist this plan' });
    }

    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number()
        .integer()
        .positive(),
      price: Yup.number()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { id, title, duration, price } = await isPlan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const schema = Yup.number()
      .integer()
      .required();

    if (!(await schema.isValid(req.params.id))) {
      return res.status(400).json({ error: 'Plan id in invalid format' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'This plan not exist' });
    }

    await plan.destroy();

    return res.json();
  }
}

// CRUD

export default new PlanController();
