const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const backupRoutes = require('./routes/backup');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Tables

// Routes
app.use('/api/products', productRoutes);
app.use('/api/backup', backupRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
