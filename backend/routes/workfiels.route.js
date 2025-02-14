import { Router } from "express";
import { addNewWorkfield, deleteWorkfield, getAllWorkfields, updateWorkfield } from "../controllers/workfiels.controller.js";

const workfieldRouter = Router();

// Route to add a new workfield
workfieldRouter.post("/addnew", addNewWorkfield);

// Route to fetch all workfields
workfieldRouter.get("/getallworkfields", getAllWorkfields);

// Route to delete a work field by ID
workfieldRouter.delete("/delete/:id", deleteWorkfield);

// Route to update a work field by ID
workfieldRouter.put("/update/:id", updateWorkfield);

export { workfieldRouter };
