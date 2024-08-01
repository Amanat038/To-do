
// create a Schema
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  item:{
    type:String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  }
},{timestamps: true});

mongoose.model("Data", dataSchema);
