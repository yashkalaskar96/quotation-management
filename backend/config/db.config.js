import Sequelize from "sequelize";

// Initialize Sequelize
const sequelize = new Sequelize("nodebackendtest", "root", "root", {
  host: "localhost",
  dialect: "mysql", // Change to 'postgres', 'sqlite', or 'mssql' if needed
  logging: false, // Disable logging (optional)
});

export { sequelize };
