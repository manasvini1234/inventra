# Inventra – Inventory Management System

Inventra is an Inventory Management System designed to digitize and simplify stock operations such as product management, receipts, delivery orders, internal transfers, stock adjustments, and inventory movement tracking.

The system is designed to replace manual registers and spreadsheet-based inventory management with a centralized digital solution.

---

## Features

### Product Management
- Add and manage products
- SKU / product code management
- Unit of Measure (UOM)
- Initial stock tracking
- Reorder level configuration
- Low-stock and out-of-stock identification

### Inventory Operations
- Receive incoming stock
- Create delivery orders
- Transfer stock between locations
- Adjust inventory quantities
- Track inventory movements through a stock ledger

### Dashboard
- Total products
- Low-stock products
- Out-of-stock products
- Total stock
- Internal transfer overview
- Recent inventory operations
- Quick access to common inventory operations

### Warehouse Management
- Manage multiple warehouses
- Manage storage locations
- Track stock across different locations

### Additional Features
- Inventory movement history
- Low-stock alerts
- Smart search and filtering
- Multi-warehouse support
- Inventory ledger tracking
- User profile and system settings

---

## Project Structure

```text
inventra/
│
├── advanced/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── package.json
│   └── .gitignore
│
├── database/
│   ├── stocksense.sql
│   └── .gitkeep
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md
