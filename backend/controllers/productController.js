const Product = require("../models/Product");

const getProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch product"
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            sku,
            category_id,
            uom,
            initial_stock,
            reorder_level
        } = req.body;

        if (!name || !sku || !uom) {
            return res.status(400).json({
                message: "name, sku and uom are required"
            });
        }

        const product = await Product.create({
            name,
            sku,
            category_id,
            uom,
            initial_stock,
            reorder_level
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create product"
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct
};