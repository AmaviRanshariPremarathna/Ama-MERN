const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const refundRoutes = require("./Route/Admin/RefundRoute");
const paymentRoutes = require("./Route/Admin/AdminPaymentRoute");
const walletRoutes = require("./Route/Admin/WalletRoute");
const fineRoutes = require("./Route/Admin/FinesRoute"); 
const notificationRoutes = require("./Route/Admin/NotificationRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/fines", fineRoutes); 
app.use("/api/notifications", notificationRoutes);


// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://admin:BS9LHlUSMt3Arjpl@cluster0.kmrzgw8.mongodb.net/financeDB_test"
  )
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
