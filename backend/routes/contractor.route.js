import { Router } from "express";
import { 
  addNewContractor, 
  getAllContractors, 
  getContractorById, 
  updateContractor, 
  deleteContractor 
} from "../controllers/contractor.controller.js";

const contractorRouter = Router();

// Route to add a new contractor
contractorRouter.post("/addnew", addNewContractor);

// Route to fetch all contractors
contractorRouter.get("/getallcontractors", getAllContractors);

// Route to fetch a single contractor by ID
contractorRouter.get("/get/:id", getContractorById);

// Route to update a contractor by ID
contractorRouter.put("/update/:id", updateContractor);

// Route to delete a contractor by ID
contractorRouter.delete("/delete/:id", deleteContractor);

export { contractorRouter };
