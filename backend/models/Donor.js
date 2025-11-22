// models/Donor.js
import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    lastDonationDate: { type: Date },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

const Donor = mongoose.model("Donor", donorSchema);
export default Donor;
