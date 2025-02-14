import { Workfield } from "../models/workfields.model.js";

const addNewWorkfield = async (req, res) => {
  const { workfieldName } = req.body;

  try {
    // Check if the workfield already exists
    const existing = await Workfield.findOne({
      where: { workfieldName },
    });

    if (existing) {
      return res.status(400).json({
        message: `The work field "${workfieldName}" already exists.`,
      });
    }

    // Create a new workfield
    const workfieldnew = await Workfield.create({ workfieldName });

    return res.status(201).json(workfieldnew);
  } catch (error) {
    console.error("Error creating workfield:", error);
    return res.status(500).json({ error: "Unable to create workfield" });
  }
};

const getAllWorkfields = async (req, res) => {
  try {
    // Fetch all workfields
    const workfieldlist = await Workfield.findAll();

    return res.status(200).send(workfieldlist)
  } catch (error) {
    console.error("Error fetching workfields:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Delete a work field by ID
const deleteWorkfield = async (req, res) => {
  try {
      const { id } = req.params;

      // Find work field by ID
      const workField = await Workfield.findByPk(id);
      if (!workField) {
          return res.status(404).json({ message: "Work field not found" });
      }

      // Delete the work field
      await workField.destroy();
      res.status(200).json({ message: "Work field deleted successfully" });
  } catch (error) {
      console.error("Error deleting work field:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};
const updateWorkfield = async (req, res) => {
  const { id } = req.params;
  const { workfieldName } = req.body;

  try {
    // Find work field by ID
    const workField = await Workfield.findByPk(id);
    if (!workField) {
      return res.status(404).json({ message: "Work field not found" });
    }

    // Check if the new workfield name already exists
    const existing = await Workfield.findOne({
      where: { workfieldName },
    });

    if (existing) {
      return res.status(400).json({
        message: `The work field "${workfieldName}" already exists.`,
      });
    }

    // Update the workfield name
    workField.workfieldName = workfieldName;
    await workField.save();

    return res.status(200).json(workField);
  } catch (error) {
    console.error("Error updating workfield:", error);
    return res.status(500).json({ error: "Unable to update workfield" });
  }
};


export { addNewWorkfield, getAllWorkfields,deleteWorkfield, updateWorkfield };
