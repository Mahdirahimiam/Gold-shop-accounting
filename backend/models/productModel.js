const db = require("../database/db");

// ایجاد جدول محصول در دیتابیس اگر وجود نداشته باشد
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT UNIQUE,
    weight REAL,
    purity REAL,
    gemstone_id INTEGER,
    price REAL NOT NULL,
    labor_cost REAL,
    tax_rate REAL,
    discount REAL,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_alert INTEGER DEFAULT 1,
    supplier_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1,
    is_custom_order INTEGER DEFAULT 0,
    FOREIGN KEY (gemstone_id) REFERENCES gemstones(id),
    FOREIGN KEY (supplier_id) REFERENCES partners(id)
  )
`);

// توابع CRUD برای محصولات

// دریافت همه محصولات
const getAllProducts = (callback) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    callback(err, rows);
  });
};

// دریافت محصول بر اساس ID
const getProductById = (id, callback) => {
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    callback(err, row);
  });
};

// افزودن یک محصول جدید
const addProduct = (product, callback) => {
  const sql = `INSERT INTO products (name, description, category, sku, barcode, weight, purity, gemstone_id, price, labor_cost, tax_rate, discount, stock_quantity, min_stock_alert, supplier_id, is_active, is_custom_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    product.name, product.description, product.category, product.sku, product.barcode,
    product.weight, product.purity, product.gemstone_id, product.price, product.labor_cost,
    product.tax_rate, product.discount, product.stock_quantity, product.min_stock_alert,
    product.supplier_id, product.is_active, product.is_custom_order
  ];
  db.run(sql, params, function (err) {
    callback(err, this ? this.lastID : null);
  });
};

// به‌روزرسانی محصول
const updateProduct = (id, product, callback) => {
  const sql = `UPDATE products SET name=?, description=?, category=?, sku=?, barcode=?, weight=?, purity=?, gemstone_id=?, price=?, labor_cost=?, tax_rate=?, discount=?, stock_quantity=?, min_stock_alert=?, supplier_id=?, is_active=?, is_custom_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`;
  const params = [
    product.name, product.description, product.category, product.sku, product.barcode,
    product.weight, product.purity, product.gemstone_id, product.price, product.labor_cost,
    product.tax_rate, product.discount, product.stock_quantity, product.min_stock_alert,
    product.supplier_id, product.is_active, product.is_custom_order, id
  ];
  db.run(sql, params, function (err) {
    callback(err, this.changes);
  });
};

// حذف محصول
const deleteProduct = (id, callback) => {
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    callback(err, this.changes);
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
