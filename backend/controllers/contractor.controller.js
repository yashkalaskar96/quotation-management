import  Contractor  from "../models/contractor.model.js";
import { Workfield } from "../models/workfields.model.js";

// Add a new contractor
const addNewContractor = async (req, res) => {
  const { name, mobileNumber, email, workFieldId, address } = req.body;

  try {
    // Check if the work field exists
    const workField = await Workfield.findByPk(workFieldId);
    if (!workField) {
      return res.status(404).json({ message: "Work field not found" });
    }

    // Create a new contractor
    const newContractor = await Contractor.create({
      name,
      mobileNumber,
      email,
      workFieldId,
      address,
    });

    return res.status(201).json(newContractor);
  } catch (error) {
    console.error("Error adding contractor:", error);
    return res.status(500).json({ error: "Unable to add contractor" });
  }
};

// Get all contractors
const getAllContractors = async (req, res) => {
  try {
    // Fetch all contractors with their associated work field
    const contractorList = await Contractor.findAll({
      include: [{ model: Workfield, attributes: ["id", "workfieldName"] }],
    });

    return res.status(200).json(contractorList);
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single contractor by ID
const getContractorById = async (req, res) => {
  try {
    const { id } = req.params;

    const contractor = await Contractor.findByPk(id, {
      include: [{ model: Workfield, attributes: ["id", "workfieldName"] }],
    });

    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    return res.status(200).json(contractor);
  } catch (error) {
    console.error("Error fetching contractor:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update a contractor
const updateContractor = async (req, res) => {
  const { id } = req.params;
  const { name, mobileNumber, email, workFieldId, address } = req.body;

  try {
    // Find contractor by ID
    const contractor = await Contractor.findByPk(id);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // Check if work field exists before updating
    if (workFieldId) {
      const workField = await Workfield.findByPk(workFieldId);
      if (!workField) {
        return res.status(404).json({ message: "Work field not found" });
      }
    }

    // Update contractor details
    contractor.name = name;
    contractor.mobileNumber = mobileNumber;
    contractor.email = email;
    contractor.workFieldId = workFieldId;
    contractor.address = address;

    await contractor.save();

    return res.status(200).json(contractor);
  } catch (error) {
    console.error("Error updating contractor:", error);
    return res.status(500).json({ error: "Unable to update contractor" });
  }
};

// Delete a contractor
const deleteContractor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find contractor by ID
    const contractor = await Contractor.findByPk(id);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // Delete the contractor
    await contractor.destroy();
    return res.status(200).json({ message: "Contractor deleted successfully" });
  } catch (error) {
    console.error("Error deleting contractor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addNewContractor, getAllContractors, getContractorById, updateContractor, deleteContractor };
