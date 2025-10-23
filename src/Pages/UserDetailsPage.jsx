import React, { useState, useEffect } from "react"; // Removed useCallback
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
// import Modal from '../components/Modal'; // Removed
// import UserForm from '../components/UserForm'; // Removed
import Toast from "../components/Toast";
import { getUserById } from "../utils/api"; // Removed updateUser, deleteUser imports
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiGlobalLine,
  RiBuildingLine,
  RiMapPinLine,
} from "react-icons/ri";

// Simplified props: no setLocalUsers or setApiUsers needed here anymore
function UserDetailsPage({ localUsers, apiUsers }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Removed
  const [userNotFound, setUserNotFound] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      setLoading(true);
      setError(null);
      setUserNotFound(false);

      let foundUser = null;

      // 1. Check local users first (local changes should override API data)
      foundUser = localUsers.find((u) => String(u.id) === String(id));

      // 2. If not found locally, check the API users currently in state
      if (!foundUser) {
        foundUser = apiUsers.find((u) => String(u.id) === String(id));
      }

      // 3. If still not found and it's an API-like ID, try fetching from API directly
      if (!foundUser && !String(id).startsWith("local-")) {
        try {
          const apiData = await getUserById(id);
          if (apiData && apiData.id) {
            foundUser = apiData;
            // No need to setApiUsers here as Edit/Delete are removed.
            // The `HomePage` will manage the primary `apiUsers` state.
          }
        } catch (err) {
          console.warn(`User ID ${id} not found from API directly.`, err);
        }
      }

      if (foundUser) {
        setUser(foundUser);
      } else {
        setUserNotFound(true);
      }
      setLoading(false);
    };

    if (id) {
      fetchAndSetUser();
    } else {
      setUserNotFound(true);
      setLoading(false);
    }
  }, [id, localUsers, apiUsers]); // Removed setApiUsers from dependencies

  // --- Removed handleEditUser and handleDeleteUser functions entirely ---

  if (loading) return <Spinner />;
  if (userNotFound)
    return (
      <div className="container mx-auto p-4 text-center dark:text-gray-200">
        <ErrorMessage message="User not found." />
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Go to Home
        </button>
      </div>
    );
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="No user data available." />;

  // Prepare full address string
  const fullAddress = [
    user.address?.street,
    user.address?.suite,
    user.address?.city,
    user.address?.zipcode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="container mx-auto p-4">
      {toastMessage && (
        <Toast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
          {user.name}
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <RiUserLine className="mr-2 text-blue-500" /> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Username:</strong> {user.username || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "N/A"}
            </p>
            <p>
              <strong>Website:</strong> {user.website || "N/A"}
            </p>
          </div>
        </div>

        {user.company && (
          <div className="mb-6 border-t pt-6 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <RiBuildingLine className="mr-2 text-green-500" /> Company Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Name:</strong> {user.company.name || "N/A"}
              </p>
              <p>
                <strong>Catch Phrase:</strong>{" "}
                {user.company.catchPhrase || "N/A"}
              </p>
              <p className="md:col-span-2">
                <strong>Business Service:</strong> {user.company.bs || "N/A"}
              </p>
            </div>
          </div>
        )}

        {user.address && (
          <div className="mb-6 border-t pt-6 border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <RiMapPinLine className="mr-2 text-purple-500" /> Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
              <p className="md:col-span-2">
                <strong>Full Address:</strong> {fullAddress || "N/A"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Removed Edit Modal */}
      {/* <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit ${user.name}`}>
        <UserForm onSubmit={handleEditUser} onCancel={() => setIsEditModalOpen(false)} initialData={user} />
      </Modal> */}
    </div>
  );
}

export default UserDetailsPage;
