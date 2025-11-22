import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import "../styles/AdminDonors.css";
import axios from "axios";

const AdminDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donors");
      setDonors(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donor?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/donors/${id}`);
      alert("Donor deleted successfully!");
      fetchDonors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete donor.");
    }
  };

  const handleEdit = async (donor) => {
    const newFullName = window.prompt("Edit Full Name:", donor.fullName);
    if (newFullName === null) return;

    const newEmail = window.prompt("Edit Email:", donor.email);
    if (newEmail === null) return;

    const newPhone = window.prompt("Edit Phone:", donor.phone);
    if (newPhone === null) return;

    const newCity = window.prompt("Edit City:", donor.city);
    if (newCity === null) return;

    try {
      await axios.put(`http://localhost:5000/api/donors/${donor._id}`, {
        fullName: newFullName,
        email: newEmail,
        phone: newPhone,
        city: newCity,
      });
      alert("Donor updated successfully!");
      fetchDonors();
    } catch (err) {
      console.error(err);
      alert("Failed to update donor.");
    }
  };

  if (loading) return <p>Loading donors...</p>;

  return (
    <div className="admin-donors-container">
      <div className="admin-donors-card">
        <h2>All Donors</h2>
        {donors.length === 0 ? (
          <p>No donors found.</p>
        ) : (
          <table className="donors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Blood Group</th>
                <th>Phone</th>
                <th>City</th>
                <th>Registered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr key={donor._id}>
                  <td>{donor.fullName}</td>
                  <td>{donor.email}</td>
                  <td>{donor.bloodGroup}</td>
                  <td>{donor.phone}</td>
                  <td>{donor.city}</td>
                  <td>{new Date(donor.createdAt).toLocaleString()}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => handleEdit(donor)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(donor._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDonors;