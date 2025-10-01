
// MongoDB Compass connection (Connection name: "admin")


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const inventoryRouter = require("./Routes/InventoryRoutes");
const productRouter = require("./Routes/ProductRoutes");
const supplierRouter = require("./Routes/SupplierRoutes");

const app = express();


//Middleware
app.use(cors());
app.use(express.json());

app.use("/inventory", inventoryRouter);
app.use("/products", productRouter);
app.use("/suppliers", supplierRouter);

mongoose.connect("mongodb://localhost:27017/admin")
.then(() => console.log("Connected to MongoDB Compass (localhost:27017, DB: admin)"))
.then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => console.log(err));