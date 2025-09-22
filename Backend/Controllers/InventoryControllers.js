const Inventory = require("../Model/InventoryModel");

//data display
const getAllInventory = async (req, res) => {

    let Items; //variable name
    
    //get all inventory items

    try {
        Items = await Inventory.find();
    }catch (err) {
        console.log(err);
    }

    //not found
    if (!Items) {
        return res.status(404).json({ message: "No inventory items found" });
    }

    //display all inventory items
    return res.status(200).json({ Items });
};

//data insert

const addInventory = async (req, res, next) => {
    const { itemName, quantity, price } = req.body;

    let inventoryItem; //variable name

    //insert inventory item
    try {
        inventoryItem = new Inventory({ itemName, quantity, price});
        await inventoryItem.save();
    } catch (err) {
        console.log(err);
    }

    //not inserted
    if (!inventoryItem) {
        return res.status(400).json({ message: "Unable to add inventory item" });
    }

    //inserted
    return res.status(200).json({ inventoryItem });
};

//Get by ID

const getById = async (req, res, next) => {
    const id = req.params.id; //get id from request parameters

    let inventoryItem; //variable name

    try {
        inventoryItem = await Inventory.findById(id);
    } catch (err) {
        console.log(err);
    }

    //not found
    if (!inventoryItem) {
        return res.status(404).json({ message: "No inventory item found" });
    }
    //found
    return res.status(200).json({ inventoryItem });

}

//Update Inventory Details
const updateInventory = async (req, res, next) => {
    const id = req.params.id;   
    const { itemName, quantity, price } = req.body;

    let inventoryItem; //variable name

    try {
        inventoryItem = await Inventory.findByIdAndUpdate(id,
             { itemName, quantity, price });
        inventoryItem = await inventoryItem.save();
    } catch (err) {
        console.log(err);
    }
    //not updated
    if (!inventoryItem) {
        return res.status(404).json({ message: "Unable to update by this ID" });
    }
    return res.status(200).json({ inventoryItem });
};

//Delete Inventory Details
const deleteInventory = async (req, res, next) => {
    const id = req.params.id;

    let inventoryItem; //variable name

    try {
        inventoryItem = await Inventory.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }   

    //not deleted
    if (!inventoryItem) {
        return res.status(404).json({ message: "Unable to delete by this ID" });
    }   
    return res.status(200).json({ message: "Inventory item successfully deleted" });
};

exports.getAllInventory = getAllInventory;
exports.addInventory = addInventory;
exports.getById = getById;
exports.updateInventory = updateInventory;
exports.deleteInventory = deleteInventory;