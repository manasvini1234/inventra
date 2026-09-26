import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/products";

const dummyReceipts = [
  {
    ref: "REC-001",
    supplier: "ABC Traders",
    items: 2,
    qty: 150,
    status: "Done",
  },
  {
    ref: "REC-002",
    supplier: "Metal Suppliers",
    items: 1,
    qty: 100,
    status: "Waiting",
  },
  {
    ref: "REC-003",
    supplier: "Office World",
    items: 3,
    qty: 75,
    status: "Ready",
  },
];

const dummyDeliveries = [
  {
    ref: "DEL-001",
    customer: "ABC Construction",
    items: 3,
    qty: 20,
    status: "Done",
  },
  {
    ref: "DEL-002",
    customer: "XYZ Industries",
    items: 1,
    qty: 10,
    status: "Ready",
  },
  {
    ref: "DEL-003",
    customer: "Local Customer",
    items: 2,
    qty: 15,
    status: "Waiting",
  },
];

const dummyTransfers = [
  {
    ref: "TRF-001",
    from: "Main Store",
    to: "Production Floor",
    product: "Steel Rods",
    qty: 50,
    status: "Done",
  },
  {
    ref: "TRF-002",
    from: "Rack A",
    to: "Rack B",
    product: "Wireless Mouse",
    qty: 10,
    status: "Ready",
  },
];

const dummyAdjustments = [
  {
    ref: "ADJ-001",
    product: "Steel Rods",
    difference: -3,
    reason: "Damaged items",
    status: "Done",
  },
  {
    ref: "ADJ-002",
    product: "Office Chair",
    difference: 5,
    reason: "Stock correction",
    status: "Ready",
  },
];

const dummyMoves = [
  {
    date: "Sep 26, 2026",
    product: "Steel Rods",
    operation: "Receipt",
    reference: "REC-001",
    quantity: "+100",
    location: "Main Store",
    status: "Done",
  },
  {
    date: "Sep 25, 2026",
    product: "Office Chair",
    operation: "Delivery",
    reference: "DEL-003",
    quantity: "-10",
    location: "Main Store",
    status: "Ready",
  },
  {
    date: "Sep 25, 2026",
    product: "Steel Rods",
    operation: "Transfer",
    reference: "TRF-002",
    quantity: "50",
    location: "Production Floor",
    status: "Done",
  },
  {
    date: "Sep 24, 2026",
    product: "Steel Rods",
    operation: "Adjustment",
    reference: "ADJ-001",
    quantity: "-3",
    location: "Main Store",
    status: "Done",
  },
  {
    date: "Sep 23, 2026",
    product: "Wireless Mouse",
    operation: "Receipt",
    reference: "REC-003",
    quantity: "+25",
    location: "Rack A",
    status: "Done",
  },
];

const dummyWarehouses = [
  {
    name: "Main Warehouse",
    description: "Primary storage facility",
    units: 285,
    locations: 8,
  },
  {
    name: "Production Floor",
    description: "Production storage",
    units: 120,
    locations: 4,
  },
  {
    name: "Secondary Warehouse",
    description: "Additional storage facility",
    units: 85,
    locations: 5,
  },
];

function App() {
  const [page, setPage] = useState("Dashboard");
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    uom: "pcs",
    initial_stock: "",
    reorder_level: "",
  });

  const loadProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          initial_stock: Number(form.initial_stock) || 0,
          reorder_level: Number(form.reorder_level) || 0,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setForm({
        name: "",
        sku: "",
        uom: "pcs",
        initial_stock: "",
        reorder_level: "",
      });

      setShowAdd(false);
      loadProducts();
    } catch {
      alert("Could not add product");
    }
  };

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.initial_stock || 0),
    0
  );

  const lowStock = products.filter(
    (p) =>
      Number(p.initial_stock) > 0 &&
      Number(p.initial_stock) <= Number(p.reorder_level)
  ).length;

  const outOfStock = products.filter(
    (p) => Number(p.initial_stock) === 0
  ).length;

  const menu = [
    ["Dashboard", "⌂"],
    ["Products", "▦"],
    ["Receipts", "↓"],
    ["Delivery Orders", "↑"],
    ["Internal Transfers", "↔"],
    ["Stock Adjustments", "⚙"],
    ["Move History", "☷"],
    ["Warehouses", "▣"],
    ["Settings", "⚙"],
  ];

  const statusClass = (status) => {
    if (status === "Done") return "success";
    if (status === "Waiting") return "warning";
    if (status === "Ready") return "info";
    if (status === "Canceled") return "danger";
    return "";
  };

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">◆</div>

          <div>
            <h2>Inventra</h2>
            <span>Inventory Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menu.map(([name, icon]) => (
            <button
              key={name}
              className={`nav-item ${page === name ? "active" : ""}`}
              onClick={() => {
                setPage(name);
                setShowAdd(false);
              }}
            >
              <span className="nav-icon">{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-item ${page === "My Profile" ? "active" : ""}`}
            onClick={() => setPage("My Profile")}
          >
            <span className="nav-icon">●</span>
            My Profile
          </button>

          <button className="nav-item logout">
            <span className="nav-icon">↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>{page}</h1>
            <p>Inventra Inventory Management System</p>
          </div>

          <div className="profile-area">
            <span className="notification">♢</span>

            <div className="avatar">S</div>

            <div>
              <strong>Sai Shree</strong>
              <small>Inventory Manager</small>
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
        {page === "Dashboard" && (
          <>
            <section className="welcome">
              <div>
                <h2>Good afternoon, Sai Shree 👋</h2>
                <p>
                  Here's your inventory operations overview for today.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() => {
                  setPage("Products");
                  setShowAdd(true);
                }}
              >
                + Add Product
              </button>
            </section>

            <section className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-icon blue-icon">▦</div>
                <div>
                  <p>Total Products</p>
                  <h2>{products.length}</h2>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon orange-icon">!</div>
                <div>
                  <p>Low Stock</p>
                  <h2>{lowStock}</h2>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon red-icon">×</div>
                <div>
                  <p>Out of Stock</p>
                  <h2>{outOfStock}</h2>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon green-icon">◆</div>
                <div>
                  <p>Total Stock</p>
                  <h2>{totalStock}</h2>
                </div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon purple-icon">↔</div>
                <div>
                  <p>Transfers</p>
                  <h2>{dummyTransfers.length}</h2>
                </div>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Inventory Overview</h3>
                    <p>Current stock status</p>
                  </div>
                </div>

                <div className="stock-stat">
                  <span>Available Products</span>
                  <strong>{products.length}</strong>
                </div>

                <div className="progress">
                  <div
                    style={{
                      width: `${Math.min(products.length * 10, 100)}%`,
                    }}
                  />
                </div>

                <div className="stock-stat">
                  <span>Low Stock Items</span>
                  <strong>{lowStock}</strong>
                </div>

                <div className="progress orange-progress">
                  <div
                    style={{
                      width: `${Math.min(lowStock * 20, 100)}%`,
                    }}
                  />
                </div>

                <div className="stock-stat">
                  <span>Out of Stock</span>
                  <strong>{outOfStock}</strong>
                </div>

                <div className="progress red-progress">
                  <div
                    style={{
                      width: `${Math.min(outOfStock * 20, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Quick Operations</h3>
                    <p>Start an inventory operation</p>
                  </div>
                </div>

                <div className="quick-actions">
                  <button onClick={() => setPage("Receipts")}>
                    <span>↓</span>
                    Receive Stock
                  </button>

                  <button onClick={() => setPage("Delivery Orders")}>
                    <span>↑</span>
                    Deliver Stock
                  </button>

                  <button onClick={() => setPage("Internal Transfers")}>
                    <span>↔</span>
                    Transfer
                  </button>

                  <button onClick={() => setPage("Stock Adjustments")}>
                    <span>⚙</span>
                    Adjust Stock
                  </button>
                </div>
              </div>
            </section>

            <section className="panel recent-panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Operations</h3>
                  <p>Latest inventory movements</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reference</th>
                      <th>Operation</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dummyMoves.slice(0, 4).map((move) => (
                      <tr key={move.reference}>
                        <td>{move.date}</td>
                        <td>
                          <strong>{move.reference}</strong>
                        </td>
                        <td>{move.operation}</td>
                        <td>{move.product}</td>
                        <td>{move.quantity}</td>
                        <td>
                          <span
                            className={`status ${statusClass(move.status)}`}
                          >
                            {move.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* PRODUCTS */}
        {page === "Products" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Product Management</h2>
                <p>Manage products and stock availability.</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => setShowAdd(!showAdd)}
              >
                + Add Product
              </button>
            </div>

            {showAdd && (
              <div className="form-card">
                <h3>Add New Product</h3>

                <form onSubmit={addProduct} className="product-form">
                  <input
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />

                  <input
                    placeholder="SKU / Code"
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value })
                    }
                    required
                  />

                  <input
                    placeholder="Unit of Measure"
                    value={form.uom}
                    onChange={(e) =>
                      setForm({ ...form, uom: e.target.value })
                    }
                    required
                  />

                  <input
                    type="number"
                    placeholder="Initial Stock"
                    value={form.initial_stock}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        initial_stock: e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Reorder Level"
                    value={form.reorder_level}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reorder_level: e.target.value,
                      })
                    }
                  />

                  <button className="primary-btn" type="submit">
                    Save Product
                  </button>
                </form>
              </div>
            )}

            <div className="panel">
              <div className="search-row">
                <input placeholder="🔍 Search products..." />

                <select>
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Furniture</option>
                  <option>Materials</option>
                  <option>Accessories</option>
                </select>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>UOM</th>
                      <th>Stock</th>
                      <th>Reorder</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((p) => {
                      const stock = Number(p.initial_stock || 0);
                      const reorder = Number(p.reorder_level || 0);

                      let status = "In Stock";
                      let cls = "success";

                      if (stock === 0) {
                        status = "Out of Stock";
                        cls = "danger";
                      } else if (stock <= reorder) {
                        status = "Low Stock";
                        cls = "warning";
                      }

                      return (
                        <tr key={p.id}>
                          <td>
                            <strong>{p.name}</strong>
                          </td>
                          <td>{p.sku}</td>
                          <td>{p.uom}</td>
                          <td>{stock}</td>
                          <td>{reorder}</td>
                          <td>
                            <span className={`status ${cls}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* RECEIPTS */}
        {page === "Receipts" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Receipts</h2>
                <p>Manage incoming stock from suppliers.</p>
              </div>

              <button className="primary-btn">+ Create Receipt</button>
            </div>

            <div className="operation-layout">
              <div className="form-card">
                <h3>Receive Incoming Goods</h3>

                <label>Supplier</label>
                <input placeholder="Supplier name" />

                <label>Product</label>
                <select>
                  <option>Select Product</option>
                  {products.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>

                <label>Quantity</label>
                <input type="number" placeholder="Enter quantity" />

                <label>Warehouse</label>
                <select>
                  <option>Main Warehouse</option>
                  <option>Production Floor</option>
                </select>

                <button className="primary-btn">
                  Validate Receipt
                </button>
              </div>

              <div className="info-card">
                <div className="info-icon">↓</div>
                <h3>Receipt Flow</h3>
                <p>
                  Incoming goods increase available stock and are recorded
                  in the inventory ledger.
                </p>

                <div className="flow">
                  <span>Supplier</span>
                  <b>→</b>
                  <span>Receipt</span>
                  <b>→</b>
                  <span>Stock</span>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Receipts</h3>
                  <p>Incoming stock transactions</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Supplier</th>
                      <th>Items</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dummyReceipts.map((item) => (
                      <tr key={item.ref}>
                        <td>
                          <strong>{item.ref}</strong>
                        </td>
                        <td>{item.supplier}</td>
                        <td>{item.items}</td>
                        <td>{item.qty}</td>
                        <td>
                          <span
                            className={`status ${statusClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* DELIVERY ORDERS */}
        {page === "Delivery Orders" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Delivery Orders</h2>
                <p>Pick, pack and deliver customer orders.</p>
              </div>

              <button className="primary-btn">+ Create Delivery</button>
            </div>

            <div className="operation-layout">
              <div className="form-card">
                <h3>Create Delivery Order</h3>

                <label>Customer</label>
                <input placeholder="Customer name" />

                <label>Product</label>
                <select>
                  <option>Select Product</option>
                  {products.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>

                <label>Quantity</label>
                <input type="number" placeholder="Enter quantity" />

                <label>Delivery Location</label>
                <input placeholder="Customer location" />

                <button className="primary-btn">
                  Validate Delivery
                </button>
              </div>

              <div className="info-card">
                <div className="info-icon">↑</div>
                <h3>Delivery Flow</h3>

                <p>
                  Validating a delivery decreases available stock and
                  records the movement in the ledger.
                </p>

                <div className="flow">
                  <span>Stock</span>
                  <b>→</b>
                  <span>Delivery</span>
                  <b>→</b>
                  <span>Customer</span>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Delivery Orders</h3>
                  <p>Recent outgoing stock</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dummyDeliveries.map((item) => (
                      <tr key={item.ref}>
                        <td>
                          <strong>{item.ref}</strong>
                        </td>
                        <td>{item.customer}</td>
                        <td>{item.items}</td>
                        <td>{item.qty}</td>
                        <td>
                          <span
                            className={`status ${statusClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* INTERNAL TRANSFERS */}
        {page === "Internal Transfers" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Internal Transfers</h2>
                <p>Move stock between warehouse locations.</p>
              </div>

              <button className="primary-btn">+ New Transfer</button>
            </div>

            <div className="operation-layout">
              <div className="form-card">
                <h3>Transfer Stock</h3>

                <label>Product</label>
                <select>
                  <option>Select Product</option>
                  {products.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>

                <label>Quantity</label>
                <input type="number" placeholder="Enter quantity" />

                <label>From Location</label>
                <select>
                  <option>Main Store</option>
                  <option>Rack A</option>
                  <option>Rack B</option>
                </select>

                <label>To Location</label>
                <select>
                  <option>Production Floor</option>
                  <option>Rack A</option>
                  <option>Rack B</option>
                </select>

                <button className="primary-btn">
                  Confirm Transfer
                </button>
              </div>

              <div className="info-card">
                <div className="info-icon">↔</div>

                <h3>Transfer Flow</h3>

                <p>
                  Internal transfers move stock between locations without
                  changing the overall stock quantity.
                </p>

                <div className="flow">
                  <span>Source</span>
                  <b>→</b>
                  <span>Transfer</span>
                  <b>→</b>
                  <span>Destination</span>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Transfers</h3>
                  <p>Internal stock movements</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Product</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dummyTransfers.map((item) => (
                      <tr key={item.ref}>
                        <td>
                          <strong>{item.ref}</strong>
                        </td>
                        <td>{item.product}</td>
                        <td>{item.from}</td>
                        <td>{item.to}</td>
                        <td>{item.qty}</td>
                        <td>
                          <span
                            className={`status ${statusClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* STOCK ADJUSTMENTS */}
        {page === "Stock Adjustments" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Stock Adjustments</h2>
                <p>Correct inventory quantities and record differences.</p>
              </div>

              <button className="primary-btn">+ New Adjustment</button>
            </div>

            <div className="operation-layout">
              <div className="form-card">
                <h3>Adjust Inventory</h3>

                <label>Product</label>
                <select>
                  <option>Select Product</option>
                  {products.map((p) => (
                    <option key={p.id}>{p.name}</option>
                  ))}
                </select>

                <label>Location</label>
                <select>
                  <option>Main Warehouse</option>
                  <option>Production Floor</option>
                  <option>Rack A</option>
                  <option>Rack B</option>
                </select>

                <label>Counted Quantity</label>
                <input type="number" placeholder="Physical count" />

                <label>Reason</label>
                <input placeholder="Reason for adjustment" />

                <button className="primary-btn">
                  Validate Adjustment
                </button>
              </div>

              <div className="info-card">
                <div className="info-icon">⚙</div>

                <h3>Adjustment Flow</h3>

                <p>
                  Physical stock differences are recorded and reflected in
                  the inventory ledger.
                </p>

                <div className="flow">
                  <span>Count</span>
                  <b>→</b>
                  <span>Difference</span>
                  <b>→</b>
                  <span>Stock Update</span>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Adjustments</h3>
                  <p>Inventory corrections</p>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Product</th>
                      <th>Difference</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dummyAdjustments.map((item) => (
                      <tr key={item.ref}>
                        <td>
                          <strong>{item.ref}</strong>
                        </td>
                        <td>{item.product}</td>
                        <td>
                          <strong
                            className={
                              item.difference > 0
                                ? "positive-number"
                                : "negative-number"
                            }
                          >
                            {item.difference > 0 ? "+" : ""}
                            {item.difference}
                          </strong>
                        </td>
                        <td>{item.reason}</td>
                        <td>
                          <span
                            className={`status ${statusClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* MOVE HISTORY */}
        {page === "Move History" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Stock Move History</h2>
                <p>Complete inventory movement ledger.</p>
              </div>
            </div>

            <div className="panel">
              <div className="search-row">
                <input placeholder="🔍 Search reference or product..." />

                <select>
                  <option>All Operations</option>
                  <option>Receipt</option>
                  <option>Delivery</option>
                  <option>Transfer</option>
                  <option>Adjustment</option>
                </select>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reference</th>
                      <th>Product</th>
                      <th>Operation</th>
                      <th>Quantity</th>
                      <th>Location</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dummyMoves.map((move) => (
                      <tr key={move.reference}>
                        <td>{move.date}</td>
                        <td>
                          <strong>{move.reference}</strong>
                        </td>
                        <td>{move.product}</td>
                        <td>{move.operation}</td>
                        <td>{move.quantity}</td>
                        <td>{move.location}</td>
                        <td>
                          <span
                            className={`status ${statusClass(move.status)}`}
                          >
                            {move.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* WAREHOUSES */}
        {page === "Warehouses" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Warehouses & Locations</h2>
                <p>Manage storage locations and inventory.</p>
              </div>

              <button className="primary-btn">+ Add Warehouse</button>
            </div>

            <div className="warehouse-grid">
              {dummyWarehouses.map((warehouse) => (
                <div className="warehouse-card" key={warehouse.name}>
                  <div className="warehouse-icon">⌂</div>

                  <h3>{warehouse.name}</h3>

                  <p>{warehouse.description}</p>

                  <strong>{warehouse.units} units</strong>

                  <span>{warehouse.locations} locations</span>

                  <button className="secondary-btn">
                    View Locations →
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SETTINGS */}
        {page === "Settings" && (
          <section>
            <div className="page-heading">
              <div>
                <h2>Settings</h2>
                <p>Configure your inventory system.</p>
              </div>
            </div>

            <div className="settings-card">
              <div>
                <h3>Inventory Settings</h3>
                <p>Manage application preferences.</p>
              </div>

              <label>
                <span>Low Stock Alerts</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label>
                <span>Automatic Stock Tracking</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label>
                <span>Multi-Warehouse Mode</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label>
                <span>Smart Search & Filters</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label>
                <span>Inventory Ledger</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </section>
        )}

        {/* PROFILE */}
        {page === "My Profile" && (
          <section>
            <div className="profile-card">
              <div className="big-avatar">S</div>

              <h2>Sai Shree</h2>

              <p>Inventory Manager</p>

              <div className="profile-details">
                <div>
                  <span>Role</span>
                  <strong>Inventory Manager</strong>
                </div>

                <div>
                  <span>Access</span>
                  <strong>Administrator</strong>
                </div>

                <div>
                  <span>System</span>
                  <strong>Inventra IMS</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>Active</strong>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;