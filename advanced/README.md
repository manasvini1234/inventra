# StockSense — Advanced Intelligence Suite

This layer adds predictive intelligence, audit tracking, QR verification, and visualization on top of core inventory operations.

## 1. Stock Intelligence (`stock-intelligence/`)
- Tracks stock levels against safety thresholds.
- Outputs product health statuses: HEALTHY, LOW_STOCK, CRITICAL.

## 2. Stock Ledger Explainer (`stock-intelligence/explainStock.js`)
- Reconstructs running totals: Opening + Receipts - Deliveries ± Transfers ± Adjustments = Current Stock.

## 3. Stock Detective (`stock-detective/`)
- Detects inventory anomalies (e.g., sudden massive write-offs or unexplained negative adjustments).

## 4. QR Product Tracking (`qr-tracking/`)
- Encodes SKU, Product ID, and Location into scannable QR payloads for warehouse verification.

## 5. Warehouse Matrix (`warehouse-view/`)
- Maps multi-warehouse topological hierarchies (Warehouse → Zone → Rack → Shelf).

## 6. Stock Forecaster (`forecasting/`)
- Analyzes daily burn rate from ledger entries to forecast days until stockout.
