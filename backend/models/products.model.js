import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import Contractor from "./contractor.model.js";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  workArea: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

// Define Relationship: A Product belongs to a Contractor
Product.belongsTo(Contractor, { foreignKey: "contractorId", onDelete: "CASCADE" });
Contractor.hasMany(Product, { foreignKey: "contractorId" });

export default Product;
