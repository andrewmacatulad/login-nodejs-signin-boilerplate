const Sequelize = require("sequelize");

const sequelize = require("../database/sequelizeDatabase");

const User = sequelize.define("user_boilerplate", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  name: Sequelize.STRING
});

module.exports = User;
