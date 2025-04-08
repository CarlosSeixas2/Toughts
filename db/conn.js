const dotenv = require("dotenv");
dotenv.config();

const { Sequelize } = require("sequelize");

const db_url = process.env.DATABASE_URL || "postgres://root:root@localhost:5432/toughtsdb";

console.log(db_url)

const sequelize = new Sequelize(db_url, {
  dialect: "postgres",
});

try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = sequelize;
