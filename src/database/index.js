import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';

import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Subscription from '../app/models/Subscription';

const models = [Plan, Subscription, Student, User];

class Database {
  constructor() {
    this.init();
  }

  init(sequelize) {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
