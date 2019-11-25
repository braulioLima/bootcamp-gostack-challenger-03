import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import Chekin from '../app/models/Chekin';
import HelpOrder from '../app/models/HelpOrder';
import Plan from '../app/models/Plan';
import Subscription from '../app/models/Subscription';
import Student from '../app/models/Student';
import User from '../app/models/User';

const models = [Chekin, HelpOrder, Plan, Subscription, Student, User];

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
