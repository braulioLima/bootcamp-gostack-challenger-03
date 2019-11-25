import * as Yup from 'yup';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

/**
 * Gym's controller to answer help orders
 */
class AnswerOrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      order: Yup.number()
        .integer()
        .positive()
        .required(),
      answer: Yup.string().required(),
    });

    const { id } = req.params;

    const { answer } = req.body;

    if (!(await schema.isValid({ order: id, answer }))) {
      return res
        .status(400)
        .json({ error: 'Validation fails. Order id invalid or answer empty' });
    }

    /**
     * Return the order if discover order with this id and
     * the order dont have  answer, returning the datas:
     * id, question, hour, student_id, student_name
     */
    const order = await HelpOrder.findByPk(id);

    if (!order) {
      return res
        .status(400)
        .json({ error: 'Not exist this order or already answerd' });
    }

    const { name, email } = await Student.findByPk(order.student_id);

    if (!name) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const { student_id, question, answer_at } = await order.update({ answer });

    /**
     * format and send email
     */
    const dateStringFormat = "'dia' dd 'de' MMMM', às' H:mm'h";

    const formatedDate = format(answer_at, dateStringFormat, { locale: ptBR });

    const orderData = {
      id,
      student: {
        student_id,
        student_name: name,
      },
      question,
      answer,
      answer_at,
    };

    const emailData = {
      student_name: name,
      email,
      question,
      answer,
      answer_at: formatedDate,
    };

    await Queue.add(AnswerMail.key, emailData);

    return res.status(201).json(orderData);
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
