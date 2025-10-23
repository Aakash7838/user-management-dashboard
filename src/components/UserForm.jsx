import React, { useState, useEffect } from "react";
import { validateUserForm } from "../utils/validation";

function UserForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    username: "",
    company: { name: "", catchPhrase: "", bs: "" },
    address: { street: "", suite: "", city: "", zipcode: "", full: "" },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      const fullAddress = [
        initialData.address?.street,
        initialData.address?.suite,
        initialData.address?.city,
        initialData.address?.zipcode,
      ]
        .filter(Boolean)
        .join(", ");
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        website: initialData.website || "",
        username: initialData.username || "",
        company: {
          name: initialData.company?.name || "",
          catchPhrase: initialData.company?.catchPhrase || "",
          bs: initialData.company?.bs || "",
        },
        address: { ...initialData.address, full: fullAddress },
        id: initialData.id,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        username: "",
        company: { name: "", catchPhrase: "", bs: "" },
        address: { street: "", suite: "", city: "", zipcode: "", full: "" },
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("company.")) {
      const companyField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        company: { ...prevData.company, [companyField]: value },
      }));
    } else if (name === "address.full") {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          full: value,
          street: value,
          suite: "",
          city: "",
          zipcode: "",
        },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const submittedAddress = {
        street: formData.address.full || formData.address.street || "",
        suite: "",
        city: "",
        zipcode: "",
      };
      const submittedData = { ...formData, address: submittedAddress };
      onSubmit(
        initialData ? { ...submittedData, id: initialData.id } : submittedData
      );
    }
  };

  const inputClass =
    "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white";
  const errorClass = "mt-1 text-sm text-red-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 dark:text-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name (Required)"
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username (Required)"
            className={inputClass}
          />
          {errors.username && <p className={errorClass}>{errors.username}</p>}
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address (Required)"
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
        <div>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (Required)"
            className={inputClass}
          />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </div>
        <div className="md:col-span-2">
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Website (e.g., example.com)"
            className={inputClass}
          />
          {errors.website && <p className={errorClass}>{errors.website}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="md:col-span-2">
          <input
            type="text"
            id="company.name"
            name="company.name"
            value={formData.company.name}
            onChange={handleChange}
            placeholder="Company Name (Required)"
            className={inputClass}
          />
          {errors["company.name"] && (
            <p className={errorClass}>{errors["company.name"]}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            id="company.catchPhrase"
            name="company.catchPhrase"
            value={formData.company.catchPhrase}
            onChange={handleChange}
            placeholder="Catch Phrase (e.g., Innovative solutions)"
            className={inputClass}
          />
          {errors["company.catchPhrase"] && (
            <p className={errorClass}>{errors["company.catchPhrase"]}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            id="company.bs"
            name="company.bs"
            value={formData.company.bs}
            onChange={handleChange}
            placeholder="Business Service (e.g., Software Development)"
            className={inputClass}
          />
          {errors["company.bs"] && (
            <p className={errorClass}>{errors["company.bs"]}</p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          id="address.full"
          name="address.full"
          value={formData.address.full}
          onChange={handleChange}
          placeholder="Full Address (Street, City, Zipcode, etc.) (Required)"
          className={inputClass}
        />
        {errors["address.full"] && (
          <p className={errorClass}>{errors["address.full"]}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          {initialData ? "Save Changes" : "Add User"}
        </button>
      </div>
    </form>
  );
}

export default UserForm;
