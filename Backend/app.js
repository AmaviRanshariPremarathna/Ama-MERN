
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

mongoose.connect("mongodb://localhost:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Compass (localhost:27017, DB: admin)"))
.then(() => {
    app.listen(5000);
})
.catch((err) => console.log(err));