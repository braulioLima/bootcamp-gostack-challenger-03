module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Braulio Lima',
          email: 'braulio@gmail.com',
          age: 34,
          weight: 95,
          height: 185,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Taliny Erika',
          email: 'taliny@viaparis.com.br',
          age: 32,
          weight: 80,
          height: 155,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
