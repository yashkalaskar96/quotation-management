import { Router } from "express";
import { 
  addNewProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "../controllers/product.controller.js";

const productRouter = Router();

// Route to add a new product
productRouter.post("/addnew", addNewProduct);

// Route to fetch all products
productRouter.get("/getallproducts", getAllProducts);

// Route to fetch a single product by ID
productRouter.get("/get/:id", getProductById);

// Route to update a product by ID
productRouter.put("/update/:id", updateProduct);

// Route to delete a product by ID
productRouter.delete("/delete/:id", deleteProduct);

export { productRouter };
