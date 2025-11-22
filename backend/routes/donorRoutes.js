import express from "express";
import {
  registerDonor,
  loginDonor,
  getDonorById,
  searchDonors,
  getAllDonors,
  deleteDonor,
  updateDonor
} from "../controllers/donorController.js";

const router = express.Router();

// Fetch all donors (must be BEFORE /:id)
router.get("/", getAllDonors);

// Donor registration & login
router.post("/register", registerDonor);
router.post("/login", loginDonor);

// Search donors
router.post("/search", searchDonors);

// Get donor by ID
router.get("/:id", getDonorById);

// Delete donor
router.delete("/:id", deleteDonor);

// Update donor
router.put("/:id", updateDonor);

export default router;
