import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';

import Student from '../app/models/Student';

import Plans from '../app/models/Plan';

const models = [User, Student, Plans];

class Database {
  constructor() {
    this.init();
  }

  init(sequelize) {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => {
      model.init(this.connection);
    });
  }
}

export default new Database();
