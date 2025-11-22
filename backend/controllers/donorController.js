import Donor from "../models/Donor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* Haversine Distance Formula */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/* REGISTER DONOR */
export const registerDonor = async (req, res) => {
  try {
    const { fullName, username, email, password, bloodGroup, phone, city, district, lastDonationDate, latitude, longitude } = req.body;

    if (!fullName || !username || !email || !password || !bloodGroup || !phone)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const existing = await Donor.findOne({ $or: [{ username }, { email }] });
    if (existing)
      return res.status(400).json({ success: false, message: "Username or email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const donor = new Donor({
      fullName,
      username,
      email,
      password: hashed,
      bloodGroup,
      phone,
      city,
      district,
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : undefined,
      latitude,
      longitude,
    });

    const saved = await donor.save();
    const donorObj = saved.toObject();
    delete donorObj.password;

    return res.status(201).json({ success: true, message: "Donor registered successfully", donor: donorObj, donorId: saved._id.toString() });
  } catch (err) {
    console.error("❌ Error in registerDonor:", err);
    if (err.code === 11000) return res.status(400).json({ success: false, message: "Duplicate key error", detail: err.keyValue });
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

/* LOGIN DONOR */
export const loginDonor = async (req, res) => {
  try {
    const { username, password } = req.body;
    const donor = await Donor.findOne({ username });
    if (!donor) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, donor.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ donorId: donor._id }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "7d" });
    const donorObj = donor.toObject();
    delete donorObj.password;

    return res.status(200).json({ success: true, message: "Login successful", donor: donorObj, donorId: donor._id.toString(), token });
  } catch (err) {
    console.error("❌ Error in loginDonor:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* GET DONOR BY ID */
export const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).select("-password");
    if (!donor) return res.status(404).json({ success: false, message: "Donor not found" });
    res.status(200).json({ success: true, donor });
  } catch (err) {
    console.error("❌ Error in getDonorById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* SEARCH DONORS */
export const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, city, district, userLat, userLon } = req.body;
    const query = {};
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (city) query.city = { $regex: new RegExp(city, "i") };
    if (district) query.district = { $regex: new RegExp(district, "i") };

    let donors = await Donor.find(query).select("-password");
    if (userLat && userLon) {
      donors = donors.map(d => {
        if (!d.latitude || !d.longitude) return d;
        const dist = calculateDistance(userLat, userLon, d.latitude, d.longitude);
        return { ...d.toObject(), distance: Number(dist.toFixed(2)) };
      });
    }
    res.status(200).json({ success: true, donors, count: donors.length });
  } catch (err) {
    console.error("❌ Error in searchDonors:", err);
    res.status(500).json({ success: false, message: "Search failed", error: err.message });
  }
};

/* GET ALL DONORS */
export const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.status(200).json(donors);
  } catch (err) {
    console.error("❌ Error in getAllDonors:", err);
    res.status(500).json({ success: false, message: "Failed to fetch donors", error: err.message });
  }
};

/* DELETE DONOR */
export const deleteDonor = async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Donor deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteDonor:", err);
    res.status(500).json({ success: false, message: "Failed to delete donor", error: err.message });
  }
};

/* UPDATE DONOR */
export const updateDonor = async (req, res) => {
  try {
    const updated = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Donor updated successfully", donor: updated });
  } catch (err) {
    console.error("❌ Error in updateDonor:", err);
    res.status(500).json({ success: false, message: "Failed to update donor", error: err.message });
  }
};

/* EXPORT ALL */
export default { registerDonor, loginDonor, getDonorById, searchDonors, getAllDonors, deleteDonor, updateDonor };
