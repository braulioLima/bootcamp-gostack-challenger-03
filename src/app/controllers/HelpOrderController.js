import * as Yup from 'yup';

import { id } from 'date-fns/locale';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

/**
 * Student's controller to help orders
 */
class HelpOrderController {
  async store(req, res) {
    const { id } = req.params;

    const { question } = req.body;

    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .positive()
        .required(),
      question: Yup.string().required(),
    });

    if (!(await schema.isValid({ id, question }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const isStudent = await Student.findByPk(id);

    if (!isStudent) {
      return res.status(400).json({ error: 'Student not exist' });
    }

    const { id: order_id } = await HelpOrder.create({
      student_id: isStudent.id,
      question,
    });

    return res.status(201).json({
      id: order_id,
      student_data: {
        student_id: isStudent.id,
        name: isStudent.name,
      },
      question,
    });
  }

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

    if (!(await Student.findByPk(id))) {
      return res.status(400).json({ error: 'Student not exist' });
    }

    const orders = await HelpOrder.findAll({
      attributes: ['id', 'question', 'answer', ['updated_at', 'update']],
      offset: (page - 1) * process.env.APP_PAGE_SIZE,
      limit: process.env.APP_PAGE_SIZE,
      where: {
        student_id: id,
      },
      order: [['updated_at', 'DESC']],
    });

    return res.json({ data: orders, page });
  }
}

export default new HelpOrderController();
