import { useEffect, useState } from "react";
import "./App.css";
import "./theme.css";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutScreen, setShowLogoutScreen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState("Dashboard");
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

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

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
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

  if (showLogoutScreen) {
    return (
      <div
        className="login-page"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          boxSizing: "border-box",
          background:
            "radial-gradient(circle at top left, #e7e0f2 0%, #f7f5fa 38%, #f2eff7 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "#ffffff",
            borderRadius: "28px",
            padding: "42px",
            boxSizing: "border-box",
            textAlign: "center",
            boxShadow: "0 24px 70px rgba(49, 46, 129, 0.16)",
            border: "1px solid rgba(99, 102, 241, 0.12)",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 22px",
              borderRadius: "20px",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #8b7bb8, #a58fca)",
              color: "#fff",
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            ◆
          </div>

          <h1 style={{ margin: "0 0 8px", color: "#24212b" }}>Signed Out</h1>
          <p style={{ margin: "0 0 28px", color: "#6f6a73", lineHeight: 1.6 }}>
            You have been safely logged out of Inventra.
          </p>

          <button
            className="primary-btn"
            style={{ width: "100%", minHeight: "52px", borderRadius: "14px" }}
            onClick={() => {
              setShowLogoutScreen(false);
              setIsLoggedIn(false);
              setPage("Dashboard");
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        className="login-page"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "28px",
          boxSizing: "border-box",
          background:
            "radial-gradient(circle at 10% 10%, #e7e0f2 0%, transparent 32%), linear-gradient(135deg, #f7f5fa 0%, #f2eff7 52%, #faf9fc 100%)",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1080px",
            minHeight: "650px",
            display: "grid",
            gridTemplateColumns: "1.02fr 0.98fr",
            background: "#fff",
            borderRadius: "30px",
            overflow: "hidden",
            boxShadow: "0 30px 90px rgba(49, 46, 129, 0.18)",
            border: "1px solid rgba(99, 102, 241, 0.12)",
          }}
        >
          <div
            style={{
              position: "relative",
              padding: "54px",
              color: "#fff",
              background:
                "linear-gradient(145deg, #29252f 0%, #433b4d 100%)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                top: "-100px",
                right: "-90px",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "rgba(167,139,250,0.12)",
                bottom: "-100px",
                left: "-80px",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "70px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "15px",
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    fontSize: "22px",
                  }}
                >
                  ◆
                </div>
                <div>
                  <div style={{ fontSize: "25px", fontWeight: 800 }}>Inventra</div>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    INVENTORY MANAGEMENT
                  </div>
                </div>
              </div>

              <div style={{ maxWidth: "450px" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 13px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.11)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.4px",
                    marginBottom: "20px",
                  }}
                >
                  SMART INVENTORY CONTROL
                </div>

                <h1
                  style={{
                    margin: "0 0 18px",
                    fontSize: "42px",
                    lineHeight: 1.12,
                    fontWeight: 800,
                  }}
                >
                  Manage your inventory with confidence.
                </h1>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.76)",
                    fontSize: "15px",
                    lineHeight: 1.8,
                  }}
                >
                  A centralized workspace for products, stock movements,
                  warehouses, receipts, deliveries, transfers, and adjustments.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  marginTop: "38px",
                  maxWidth: "430px",
                }}
              >
                {[
                  ["✓", "Track products and stock levels"],
                  ["↔", "Manage inventory movements"],
                  ["▣", "Organize warehouses and locations"],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "13px",
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "14px",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "9px",
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(255,255,255,0.12)",
                        fontWeight: 800,
                      }}
                    >
                      {icon}
                    </span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: "12px",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Inventra Inventory Management System
            </div>
          </div>

          <div
            style={{
              padding: "54px 58px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ maxWidth: "430px", width: "100%", margin: "0 auto" }}>
              <div style={{ marginBottom: "34px" }}>
                <div
                  style={{
                    color: "#8b7bb8",
                    fontSize: "13px",
                    fontWeight: 800,
                    marginBottom: "10px",
                    letterSpacing: "0.5px",
                  }}
                >
                  WELCOME BACK
                </div>
                <h2
                  style={{
                    margin: "0 0 9px",
                    color: "#24212b",
                    fontSize: "32px",
                    fontWeight: 800,
                  }}
                >
                  Sign in to Inventra
                </h2>
                <p style={{ margin: 0, color: "#6f6a73", fontSize: "14px" }}>
                  Enter your account details to continue to your dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#302b36",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Email or Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      height: "52px",
                      boxSizing: "border-box",
                      border: "1px solid #ded9e5",
                      borderRadius: "13px",
                      padding: "0 16px",
                      outline: "none",
                      fontSize: "14px",
                      background: "#fafaff",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#302b36",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Password
                  </label>

                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
                      required
                      style={{
                        width: "100%",
                        height: "52px",
                        boxSizing: "border-box",
                        border: "1px solid #ded9e5",
                        borderRadius: "13px",
                        padding: "0 54px 0 16px",
                        outline: "none",
                        fontSize: "14px",
                        background: "#fafaff",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "8px",
                        height: "36px",
                        width: "38px",
                        border: "0",
                        borderRadius: "9px",
                        background: "transparent",
                        color: "#6f6a73",
                        cursor: "pointer",
                      }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? "◉" : "○"}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "26px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "13px",
                      color: "#6f6a73",
                      cursor: "pointer",
                    }}
                  >
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => alert("Password recovery can be connected here.")}
                    style={{
                      border: 0,
                      background: "transparent",
                      color: "#8b7bb8",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  className="primary-btn"
                  type="submit"
                  style={{
                    width: "100%",
                    height: "54px",
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: 800,
                  }}
                >
                  Sign In →
                </button>
              </form>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  margin: "30px 0 22px",
                  color: "#aaa5ae",
                  fontSize: "11px",
                }}
              >
                <div style={{ flex: 1, height: "1px", background: "#ece8ef" }} />
                SECURE ACCESS
                <div style={{ flex: 1, height: "1px", background: "#ece8ef" }} />
              </div>

              <div
                style={{
                  padding: "13px 15px",
                  borderRadius: "12px",
                  background: "#f6f2fa",
                  border: "1px solid #e8e1f0",
                  color: "#6e6878",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: "#433d4d" }}>Inventory Manager</strong>
                <br />
                Access your products, stock operations, warehouses, and reports
                from one workspace.
              </div>

              <p
                style={{
                  margin: "24px 0 0",
                  textAlign: "center",
                  color: "#aaa5ae",
                  fontSize: "11px",
                }}
              >
                © 2026 Inventra · Inventory Management System
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 820px) {
            .login-page > div {
              grid-template-columns: 1fr !important;
            }
            .login-page > div > div:first-child {
              display: none !important;
            }
          }
        `}</style>
      </div>
    );
  }


  return (
    <div className={`app-layout ${theme === "dark" ? "dark-mode" : ""}`}>
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

          <button
            className="nav-item logout"
            onClick={() => {
              setIsLoggedIn(false);
              setShowLogoutScreen(true);
              setPage("Dashboard");
              setShowAdd(false);
            }}
          >
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
                <h2>Good morning, Manager 👋</h2>
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
                <div className="kpi-icon lavender-icon">▦</div>
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
                <div className="kpi-icon lavender-icon">↔</div>
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

              <div className="theme-setting">
                <span>Appearance</span>
                <div className="theme-options">
                  <button
                    type="button"
                    className={theme === "light" ? "theme-option active" : "theme-option"}
                    onClick={() => setTheme("light")}
                  >
                    ☀ Light
                  </button>
                  <button
                    type="button"
                    className={theme === "dark" ? "theme-option active" : "theme-option"}
                    onClick={() => setTheme("dark")}
                  >
                    ☾ Dark
                  </button>
                </div>
              </div>
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
                  <span>Full Name</span>
                  <strong>Sai Shree</strong>
                </div>

                <div>
                  <span>Role</span>
                  <strong>Inventory Manager</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>saishree@inventra.com</strong>
                </div>

                <div>
                  <span>Access Level</span>
                  <strong>Administrator</strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>Inventory Operations</strong>
                </div>

                <div>
                  <span>System</span>
                  <strong>Inventra IMS</strong>
                </div>

                <div>
                  <span>Account Status</span>
                  <strong>Active</strong>
                </div>

                <div>
                  <span>Preferred Theme</span>
                  <strong>{theme === "dark" ? "Dark Mode" : "Light Mode"}</strong>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setPage("Settings")}
                >
                  Account Settings
                </button>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setShowLogoutScreen(true);
                    setPage("Dashboard");
                    setShowAdd(false);
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;