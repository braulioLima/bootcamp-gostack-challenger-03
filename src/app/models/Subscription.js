import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        monthPrice: Sequelize.VIRTUAL,
        duration: Sequelize.VIRTUAL,
        price: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student_data',
    });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan_data' });
  }
}

export default Subscription;
