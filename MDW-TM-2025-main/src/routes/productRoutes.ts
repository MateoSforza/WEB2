import express from "express";
import { authenticateJWT } from "../middleware/auth";
import { getProducts } from "../controllers/productController"; // ejemplo

const router = express.Router();

router.use(authenticateJWT); // Protege todas las rutas de productos

router.get("/", getProducts);
// ...otras rutas...

export default router;