const Sequelize = require("sequelize");

const sequelize = require("../database/sequelizeDatabase");

const Human = sequelize.define("test_table", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  address: Sequelize.STRING
});

module.exports = Human;
