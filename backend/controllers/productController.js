const productModel = require('../models/productModel'); // مسیر صحیح را چک کن

// دریافت همه محصولات
const getAllProducts = (req, res) => {
  productModel.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(products);
  });
};

// دریافت محصول بر اساس ID
const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "شناسه نامعتبر است" });
  }

  productModel.getProductById(id, (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }
    res.json(product);
  });
};

// افزودن محصول جدید
const addProduct = (req, res) => {
  const { name, sku, price } = req.body;

  if (!name || !sku || !price) {
    return res.status(400).json({ message: "نام، کد SKU و قیمت الزامی هستند" });
  }

  productModel.addProduct(req.body, (err, productId) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: productId, message: "محصول با موفقیت اضافه شد" });
  });
};

// به‌روزرسانی محصول
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "شناسه نامعتبر است" });
  }

  const { name, sku, price } = req.body;
  if (!name || !sku || !price) {
    return res.status(400).json({ message: "نام، کد SKU و قیمت نباید خالی باشند" });
  }

  productModel.updateProduct(id, req.body, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }
    res.json({ message: "محصول با موفقیت به‌روزرسانی شد" });
  });
};

// حذف محصول
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: "شناسه نامعتبر است" });
  }

  productModel.deleteProduct(id, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ message: "محصول یافت نشد" });
    }
    res.json({ message: "محصول با موفقیت حذف شد" });
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
