const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    // required: true,
  },
  s3Key: {
    type: String,
    // required: true,
  },
  s3Url: {
    type: String,
    // required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    // required: true,
  },
  category: {
    type: String,
    // required: true,
  },
  traction: {
    type: String,
    // required: true,
  },
  fundsRaised: {
    type: String,
    // required: true,
  },
  customers: {
    type: String,
    // required: true,
  },
  marketSize: {
    type: String,
    // required: true,
  },
  team: {
    type: String,
    // required: true,
  },
  sourceId: {
    type: String,
    require: true,
  },
  revenue: {
    type: String,
    // required: true,
  },
  locatedAt: {
    type: String,
    // required: true,
  },
  summary: {
    type: String,
    // required: true,
  },
});

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  files: [fileSchema],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;