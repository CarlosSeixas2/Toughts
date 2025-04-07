const { Sequelize } = require("sequelize");

const port = process.env.PORT || 3000;
const db_name = process.env.DB_NAME || "toughtsdb";
const db_password = process.env.DB_PASSWORD || "root";

const sequelize = new Sequelize(db_name, "root", db_password, {
  host: "localhost",
  dialect: "postgres",
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
