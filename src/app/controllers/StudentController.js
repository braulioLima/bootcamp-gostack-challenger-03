import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      weight: Yup.number()
        .integer()
        .positive()
        .required(),
      height: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const studentExist = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExist) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { name, email, age, weight, height } = await Student.create(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldEmail: Yup.string().email(),
      email: Yup.string()
        .email()
        .when('oldEmail', (oldEmail, field) =>
          oldEmail ? field.required() : field
        ),
      confirmEmail: Yup.string()
        .email()
        .when('email', (email, field) => (email ? field.required() : field)),

      age: Yup.number()
        .integer()
        .positive(),
      weight: Yup.number()
        .integer()
        .positive(),
      height: Yup.number()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { email, oldEmail } = req.body;

    /**
     * Verify if email is not undefined and if have one student using the email if emai
     */

    if (email && email !== oldEmail) {
      const studentExist = await Student.findOne({ where: { email } });

      if (studentExist) {
        return res.status(400).json({ error: 'Student already exists' });
      }
    }

    const student = await Student.findOne({ where: { email: oldEmail } });

    const { name, age, weight, height } = await student.update(req.body);

    return res.json({
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
