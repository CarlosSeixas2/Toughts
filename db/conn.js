const { Sequelize } = require("sequelize");

const db_port = process.env.DB_PORT || 5432;
const db_name = process.env.DB_NAME || "toughtsdb";
const db_password = process.env.DB_PASSWORD || "root";
const db_username = process.env.DB_USERNAME || "root";

const sequelize = new Sequelize(db_name, db_username, db_password, {
  host: "localhost",
  dialect: "postgres",
  port: db_port,
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
