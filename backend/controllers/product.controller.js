import Product from "../models/products.model.js";
import Contractor from "../models/contractor.model.js";

// Add a new product
const addNewProduct = async (req, res) => {
  const products = req.body; // Receive array of products

  try {
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    // Validate all contractors exist
    const contractorIds = [...new Set(products.map((p) => p.contractorId))];
    const existingContractors = await Contractor.findAll({
      where: { id: contractorIds },
    });

    if (existingContractors.length !== contractorIds.length) {
      return res.status(404).json({ message: "One or more contractors not found" });
    }

    // Insert multiple products in a single operation
    const newProducts = await Product.bulkCreate(products);

    return res.status(201).json(newProducts);
  } catch (error) {
    console.error("Error adding products:", error);
    return res.status(500).json({ error: "Unable to add products" });
  }
};


// Get all products with contractor details
const getAllProducts = async (req, res) => {
  try {
    const productList = await Product.findAll({
      include: [
        { model: Contractor, attributes: ["id", "name", "mobileNumber"] }
      ],
    });

    return res.status(200).json(productList);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Contractor, attributes: ["id", "name", "mobileNumber"] }
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, rate, workArea, contractorId } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (contractorId) {
      const contractor = await Contractor.findByPk(contractorId);
      if (!contractor) {
        return res.status(404).json({ message: "Contractor not found" });
      }
    }

    // Update product details
    product.productName = productName;
    product.rate = rate;
    product.workArea = workArea;
    product.contractorId = contractorId;

    await product.save();

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Unable to update product" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addNewProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
