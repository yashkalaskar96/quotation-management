import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Workfield } from "./workfields.model.js";

const Contractor = sequelize.define("Contractor", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
});

// Define Relationship: A Contractor belongs to a WorkField
Contractor.belongsTo(Workfield, { foreignKey: "workFieldId" });
Workfield.hasMany(Contractor, { foreignKey: "workFieldId" });
export default Contractor;
