//Password - wq32nIltZDvJlAl0

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/InventoryRoutes");

const app = express();

//Middleware
app.use(express.json());
app.use("/inventory",router);

mongoose.connect("mongodb+srv://admin:wq32nIltZDvJlAl0@cluster0.krl79qs.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log(err));