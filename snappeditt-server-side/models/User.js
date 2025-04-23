const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Add unique constraint
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    address: {
      streetNumber: String,
      streetName: String,
      apartmentUnit: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      isoCode: String, // Country ISO code
      stateCode: String, // State ISO code
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timestamps: true }
);

// Before save encrypt password

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to login user
UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User not found");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw Error("Username or password is incorrect");
  }
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
