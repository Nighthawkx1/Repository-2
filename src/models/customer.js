const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const mongooseHistory = require('mongoose-history')

const Schema = mongoose.Schema;

const customersSchema = new Schema({
  
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
customersSchema.plugin(timestamps);
customersSchema.plugin(mongooseHistory)

module.exports = mongoose.model("Customers", customersSchema);