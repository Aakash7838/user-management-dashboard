import React, { useState, useEffect, useMemo, useCallback } from "react";
import UserCard from "../components/UserCard";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import Toast from "../components/Toast";
import { getAllUsers, addUser } from "../utils/api";
import { RiSortAsc, RiSortDesc } from "react-icons/ri";

function HomePage({
  showAddUserModal,
  setShowAddUserModal,
  localUsers,
  setLocalUsers,
  apiUsers,
  setApiUsers,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchApiUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setApiUsers(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch users from API.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApiUsers();
  }, [setApiUsers]);

  const allUsers = useMemo(() => {
    const combined = [...apiUsers];
    localUsers.forEach((localUser) => {
      const existingIndex = combined.findIndex(
        (apiUser) => String(apiUser.id) === String(localUser.id)
      );
      if (existingIndex > -1) {
        // If a local user has the same ID as an API user, the local version takes precedence
        combined[existingIndex] = localUser;
      } else {
        // Otherwise, it's a new local-only user, so add it
        combined.push(localUser);
      }
    });
    return combined;
  }, [apiUsers, localUsers]);

  const filteredAndSortedUsers = useMemo(() => {
    let currentUsers = [...allUsers];

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentUsers = currentUsers.filter((user) => {
        // --- BROADER SEARCH LOGIC ---
        // Checks various fields for the search term (case-insensitive)
        const matchesName = user.name
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesEmail = user.email
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesPhone = user.phone
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesWebsite = user.website
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesUsername = user.username
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);

        // Company fields (with optional chaining for safety)
        const matchesCompanyName = user.company?.name
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesCompanyCatchPhrase = user.company?.catchPhrase
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesCompanyBs = user.company?.bs
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);

        // Address fields (with optional chaining for safety)
        const matchesAddressStreet = user.address?.street
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesAddressSuite = user.address?.suite
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesAddressCity = user.address?.city
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);
        const matchesAddressZipcode = user.address?.zipcode
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);

        // For manually added users, 'address.full' might be used if only one address field was provided
        const matchesAddressFull = user.address?.full
          ?.toLowerCase()
          .includes(lowercasedSearchTerm);

        return (
          matchesName ||
          matchesEmail ||
          matchesPhone ||
          matchesWebsite ||
          matchesUsername ||
          matchesCompanyName ||
          matchesCompanyCatchPhrase ||
          matchesCompanyBs ||
          matchesAddressStreet ||
          matchesAddressSuite ||
          matchesAddressCity ||
          matchesAddressZipcode ||
          matchesAddressFull
        );
      });
    }

    currentUsers.sort((a, b) => {
      let valA, valB;
      // Handle sorting by name
      if (sortKey === "name") {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      }
      // Handle sorting by company name
      else if (sortKey === "company.name") {
        valA = a.company?.name?.toLowerCase() || ""; // Default to empty string if no company name
        valB = b.company?.name?.toLowerCase() || "";
      }

      // Apply sort order
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0; // Values are equal
    });

    return currentUsers;
  }, [allUsers, searchTerm, sortKey, sortOrder]);

  const handleAddUser = useCallback(
    async (newUserData) => {
      try {
        // Simulate API call to fulfill assignment requirement (JSONPlaceholder POST always returns { id: 101 })
        // The actual data we care about for local storage is `newUserData`.
        await addUser(newUserData);

        // FIX: Generate a truly unique local ID for each added user.
        // This prevents overwrites and ensures unlimited additions work correctly.
        const uniqueLocalId = `local-${Date.now()}-${Math.floor(
          Math.random() * 1000000
        )}`;

        // Construct the final user object to be added to localUsers state
        // Ensure nested objects (company, address) are always present for consistency,
        // even if fields were left blank in the form, to prevent errors on UserDetailsPage.
        const finalAddedUser = {
          ...newUserData, // All primary data from the form
          id: uniqueLocalId, // Assign our unique local ID
          company: {
            name: newUserData.company?.name || "",
            catchPhrase: newUserData.company?.catchPhrase || "",
            bs: newUserData.company?.bs || "",
          },
          address: {
            street: newUserData.address?.street || "",
            suite: newUserData.address?.suite || "",
            city: newUserData.address?.city || "",
            zipcode: newUserData.address?.zipcode || "",
            geo: { lat: "0", lng: "0" }, // Mock geo for consistency with API users
          },
        };

        // Add the new user to the localUsers state array
        // Using functional update `(prevUsers) => [...]` ensures we always use the latest state.
        setLocalUsers((prevUsers) => [...prevUsers, finalAddedUser]);

        // Close the Add User modal and show a success message
        setShowAddUserModal(false);
        setToastMessage({
          type: "success",
          message: `${finalAddedUser.name} added successfully!`,
        });
      } catch (err) {
        // Handle any errors during the add process
        setError("Failed to add user.");
        setToastMessage({ type: "error", message: "Failed to add user." });
        console.error(err);
      }
    },
    [setLocalUsers, setShowAddUserModal, setToastMessage, setError]
  ); // Dependencies for useCallback

  return (
    <div className="container mx-auto p-4">
      {/* Toast notifications for user feedback */}
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        {/* Search input field */}
        <input
          type="text"
          placeholder="Search all user details (name, phone, address, company...)"
          className="w-full md:flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Sort by dropdown and order toggle button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label
            htmlFor="sort-by"
            className="text-gray-700 dark:text-gray-300 whitespace-nowrap"
          >
            Sort by:
          </label>
          <select
            id="sort-by"
            className="p-3 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="company.name">Company Name</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
          >
            {sortOrder === "asc" ? (
              <RiSortAsc size={20} />
            ) : (
              <RiSortDesc size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Conditional rendering for loading, error, or no users found */}
      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && filteredAndSortedUsers.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No users found.
        </p>
      )}

      {/* Grid for displaying user cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Modal for adding new users */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
      >
        <UserForm
          onSubmit={handleAddUser}
          onCancel={() => setShowAddUserModal(false)}
          initialData={null}
        />
      </Modal>
    </div>
  );
}

export default HomePage;
