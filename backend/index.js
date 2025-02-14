import express from "express";
import cors from 'cors';
import { sequelize } from "./config/db.config.js";
import { workfieldRouter } from "./routes/workfiels.route.js";
import { contractorRouter } from "./routes/contractor.route.js";
import { productRouter } from "./routes/products.route.js";
const app = express();
const PORT = 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Automatically create/update the table based on the model
    await sequelize
      .sync({ alter: true })
      .then(() => console.log("Models synchronized successfully."))
      .catch((error) => console.error("Error synchronizing models:", error));

      console.log(sequelize.config.database);

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Middleware to parse JSON
app.use(express.json());
app.use(cors())
app.use("/workfield", workfieldRouter);
app.use("/contractor",contractorRouter );
app.use("/products",productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
