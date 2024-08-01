
const express = require('express'); 
const router = express.Router(); // Create an Express Router instance
const mongoose = require('mongoose'); 
const Data = mongoose.model('Data'); // Get the Mongoose model for 'Data'

// Route to add a new item

router.post('/data', async (req, res) => {
  const { item } = req.body; // Extract the 'item' from the request body

  if (!item) {
    return res.status(400).json({ error: 'Item is required' });
  }

  try {
    const newItem = new Data({ item }); // Create a new instance of the 'Data' model
    const savedItem = await newItem.save(); // Save the new item to the database
    res.status(201).json({ result: "Success", data: savedItem });
  } catch (error) {
    
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Route to get all data
router.get('/getdata', async (req, res) => {
  try {
    const items = await Data.find(); // Fetch all items from the database
    res.status(200).json(items); 
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Route to delete an item by ID
router.delete('/deleteitem/:id', async (req, res) => {
  try {
    const deletedItem = await Data.findByIdAndDelete(req.params.id); // Delete the item with the specified ID
    if (!deletedItem) {
     
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ result: "Item deleted successfully", item: deletedItem }); 
  } catch (error) {
    
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Route to update an item by ID
router.put('/edit/:id', async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  const { item } = req.body; // Extract the 'item' from the request body

  if (!item) {

    return res.status(400).json({ error: 'Item is required' });
  }

  try {
    const updatedItem = await Data.findByIdAndUpdate(id, { item, completed: false }, { new: true }); // Update the item with the specified ID
    if (!updatedItem) {
     
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ result: 'Success', item: updatedItem }); 
  } catch (err) {

    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Route to mark an item as complete or incomplete
router.put('/complete/:id', async (req, res) => {
  try {
    const { completed } = req.body; // Extract the 'completed' status from the request body
    const updatedItem = await Data.findByIdAndUpdate(req.params.id, { completed }, { new: true }); // Update the completion status of the item with the specified ID
    if (!updatedItem) {
      
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ result: 'Success', item: updatedItem }); 
  } catch (err) {
    
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router; // Export the router to be used in the main application
