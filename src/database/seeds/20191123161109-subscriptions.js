const date_fns = require('date-fns').addMonths;

const subMonths = require('date-fns/subMonths');

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'subscriptions',
      [
        {
          student_id: 1,
          plan_id: 1,
          start_date: subMonths(new Date(), 2),
          end_date: date_fns(subMonths(new Date(), 2), 1),
          price: 129,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: 2,
          plan_id: 2,
          start_date: new Date(),
          end_date: date_fns(new Date(), 3),
          price: 109 * 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          student_id: 1,
          plan_id: 3,
          start_date: new Date(),
          end_date: date_fns(new Date(), 3),
          price: 109 * 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
