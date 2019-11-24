import Sequelize, { Model } from 'sequelize';
import { addMonths, parseISO } from 'date-fns';
import Plan from './Plan';

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

    this.addHook('beforeSave', async subscription => {
      const { plan_id, start_date } = subscription;

      const { duration, price: monthPrice } = await Plan.findByPk(plan_id);

      subscription.price = duration * monthPrice;

      subscription.end_date = addMonths(start_date, duration);
    });

    this.addHook('beforeUpdate', async subscription => {
      const { plan_id, start_date } = subscription;

      const { duration, price: monthPrice } = await Plan.findByPk(plan_id);

      subscription.price = duration * monthPrice;

      subscription.end_date = addMonths(start_date, duration);
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Subscription;
