import React, { useState } from "react";

const CampsManager = () => {
  const [camps, setCamps] = useState([
    {
      id: 1,
      name: "Relief Camp - Patna",
      capacity: 120,
      occupied: 85,
      contact: "9998887777",
      status: "Active",
    },
    {
      id: 2,
      name: "Shelter Camp - Guwahati",
      capacity: 90,
      occupied: 72,
      contact: "9876543210",
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    contact: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddCamp = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.capacity || !formData.contact) return;

    const newCamp = {
      id: Date.now(),
      name: formData.name,
      capacity: parseInt(formData.capacity),
      occupied: 0,
      contact: formData.contact,
      status: "Active",
    };

    setCamps((prev) => [...prev, newCamp]);
    setFormData({ name: "", capacity: "", contact: "" });
  };

  const handleToggleStatus = (id) => {
    setCamps((prev) =>
      prev.map((camp) =>
        camp.id === id
          ? { ...camp, status: camp.status === "Active" ? "Closed" : "Active" }
          : camp
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Camps Manager
      </h2>

      {/* Add Camp Form */}
      <form
        onSubmit={handleAddCamp}
        className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Add New Relief Camp
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Camp Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-all"
        >
          ➕ Add Camp
        </button>
      </form>

      {/* Camps List */}
      <div className="grid md:grid-cols-2 gap-6">
        {camps.map((camp) => (
          <div
            key={camp.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {camp.name}
            </h3>
            <p className="text-gray-600 mb-1">
              Capacity: {camp.occupied}/{camp.capacity}
            </p>
            <p className="text-gray-600 mb-1">📞 {camp.contact}</p>
            <p
              className={`text-sm font-medium ${
                camp.status === "Active" ? "text-green-700" : "text-red-600"
              }`}
            >
              Status: {camp.status}
            </p>

            <button
              onClick={() => handleToggleStatus(camp.id)}
              className="mt-3 bg-gray-200 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
            >
              Toggle Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampsManager;
