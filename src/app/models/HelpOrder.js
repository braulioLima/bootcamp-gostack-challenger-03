import { Model, Sequelize } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeUpdate', async HelpOrder => {
      const today = new Date();

      HelpOrder.answer_at = today;
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student_data',
    });
  }
}

export default HelpOrder;
