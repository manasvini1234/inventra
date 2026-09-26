const db = require("../config/db");

const Product = {
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT id, name, sku, category_id, uom, initial_stock, reorder_level, created_at
             FROM products
             ORDER BY id DESC`
        );

        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT id, name, sku, category_id, uom, initial_stock, reorder_level, created_at
             FROM products
             WHERE id = ?`,
            [id]
        );

        return rows[0];
    },

    create: async (product) => {
        const [result] = await db.query(
            `INSERT INTO products
            (name, sku, category_id, uom, initial_stock, reorder_level)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                product.name,
                product.sku,
                product.category_id || null,
                product.uom,
                product.initial_stock || 0,
                product.reorder_level || 0
            ]
        );

        return Product.getById(result.insertId);
    }
};

module.exports = Product;