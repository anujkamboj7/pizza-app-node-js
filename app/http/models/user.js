const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
      default: null,
    },
    name: {
      firstname: { type: String, trim: true, default: null },
      middlename: { type: String, trim: true },
      lastname: { type: String, trim: true, default: null },
    },
    email: { type: String, unique: true, default: null, trim: true },
    address: [
      {
        firstname: { type: String, trim: true, default: null },
        lastname: { type: String, trim: true, default: null },
        street_address: { type: String },
        city: { type: String },
        locality: { type: String },
        state: { type: String },
        landmark: { type: String },
        pincode: { type: Number },
        country: { type: String, default: "India" },
        address_type: { type: String, default: "Home" },
        phone: { type: Number, default: null, trim: true },
      },
    ],
    password: { type: String },
    gender: { type: String, default: null },
    role: {
      type: String,
      default: "customer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.displayName) this.displayName = this.name.firstName;

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
