import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

/**
 * Gym's controller to answer help orders
 */
class AnswerOrderController {
  async store(req, res) {
    return res.json();
  }

  async index(req, res) {
    /**
     * Check if have valid page format
     */
    const validPageFormat = Yup.number()
      .integer()
      .positive();

    const { page = 1 } = req.query;

    if (!(await validPageFormat.isValid(page))) {
      return res
        .status(401)
        .json({ error: 'Validation Fails, page format incorrect' });
    }

    const orders = await HelpOrder.findAndCountAll({
      attributes: ['id', 'question'],
      limit: process.env.APP_PAGE_SIZE,
      offset: (page - 1) * process.env.APP_PAGE_SIZE,
      where: {
        answer_at: null,
      },
      include: {
        model: Student,
        as: 'student_data',
        attributes: ['id', 'name'],
      },
      order: [['updated_at', 'DESC']],
    });

    return res.json({ data: orders, page });
  }
}

export default new AnswerOrderController();
