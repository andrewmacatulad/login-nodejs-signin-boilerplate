const Sequelize = require("sequelize");

const opts = {
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true
  }
};

// const sequelize = new Sequelize("sample_schema", "root", "root", {
//   dialect: "mysql",
//   host: "localhost",
//   define: {
//     freezeTableName: true,
//     timestamps: false
//   }
// });

const sequelize = new Sequelize("postgres", "postgres", "asakapa", {
  dialect: "postgres",
  host: "localhost",
  define: {
    freezeTableName: true,
    timestamps: false
  }
});

module.exports = sequelize;
