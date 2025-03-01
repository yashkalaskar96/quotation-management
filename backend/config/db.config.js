import Sequelize from "sequelize";

// Initialize Sequelize
const sequelize = new Sequelize("quotationmanagement", "root", "Omkar@123", {
  host: "localhost",
  dialect: "mysql", // Change to 'postgres', 'sqlite', or 'mssql' if needed
  logging: false, // Disable logging (optional)
});

export { sequelize };
