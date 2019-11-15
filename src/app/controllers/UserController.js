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
}

export default new UserController();
