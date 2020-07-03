const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customersSchema = new Schema({
  address: {
    type: String,
    unique: false,
    required: false
  },
  CompanyName: {
    type: String,
    unique: false,
    required: false
  },
  Name: {
    type: String,
    unique: false,
    required: false
  },
  Company: {
    type: String,
    unique: false,
    required: false
  },
  Contact: {
    type: String,
    unique: false,
    required: false
  },
  Company2: {
    type: String,
    unique: false,
    required: false
  },
  Phone: {
    type: String,
    unique: false,
    required: false
  },
  Email: {
    type: String,
    unique: false,
    required: false
  },
  Address: {
    type: String,
    unique: false,
    required: false
  }
});

module.exports = mongoose.model("Customers", customersSchema);