import bcrypt from 'bcryptjs';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (userExist) {
      return res.status(400).json({ error: 'User alredy exists' });
    }

    const user = await User.create(req.body);

    const { id, name, email } = user;

    return res.status(201).json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userID);

    if (email && email !== user.email) {
      const userExist = await User.findOne({ where: { email } });

      if (userExist) {
        return res.status(401).json({ error: 'User already exist' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);
    return res.status(201).json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
