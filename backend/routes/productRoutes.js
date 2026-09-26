const express = require("express");

const {
    getProducts,
    getProductById,
    createProduct
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);

module.exports = router;