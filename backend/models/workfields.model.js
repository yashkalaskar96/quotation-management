import DataTypes from 'sequelize'
import { sequelize } from '../config/db.config.js';

const Workfield = sequelize.define('workfield', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    workfieldName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt columns
});

export {Workfield}
