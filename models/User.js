const mongoose = require("mongoose");
const { Schema } = mongoose;
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
  teamMembers: {
    type: String,
    // required: true,
  },
  teamSize:{
type:Number,
// required:true,
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

// const userSchema = new mongoose.Schema({
//   auth0Id: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
  // status: {
  //   type: String,
  //   default: "expired",
  // },
  // paymentId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'PaymentPlans', 
  // },
//   files: [fileSchema],
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// module.exports = User;




const userSchema = new  mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address']
  },
  reviewFiles: [
    {
      filename: {
        type: String,
        required: true,
        trim: true
      },
      filehash: {
        type: String,
        required: true,
        trim: true
      },
      fileUrl: {
        type: String,
        required: true,
        trim: true
      },
      fileDetails: {
        type: Schema.Types.Mixed,
        required: true
      },
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  investorFiles:  [fileSchema],
  status: {
    type: String,
    default: "expired",
  },
  paymentPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentPlans', 
    default: null
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});


const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
