import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

function UserList() {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState(" ");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async () => {
    try {
      if (userToDelete) {
        await deleteUser(userToDelete);
        toast.success('User deleted successfully');
        setIsModalOpen(false);
        refetch(); // Refetch to get updated data
      }
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail
      });
      setEditableUserId(null);
      refetch();
      toast.success('User updated successfully')
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const openModal = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="flex">
      {/* Admin Menu */}
      <div className="fixed top-0 left-0 h-full w-[1px]  z-20">
        <AdminMenu />
      </div>

      {/* Main Content */}
      <div className="p-4 w-full">
        <h1 className="pl-[8rem] text-2xl font-semibold mb-6 text-white">Users</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data.message || error.message}</Message>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Table */}
            <table className="w-full table table-pin-cols md:w-4/5 mx-auto table-auto border-collapse text-white">
              <thead>
                <tr className="text-xl">
                  <th className="px-6 py-3 text-left border-b">ID</th>
                  <th className="px-6 py-3 text-left border-b">NAME</th>
                  <th className="px-6 py-3 text-left border-b">EMAIL</th>
                  <th className="px-6 py-3 text-left border-b">ADMIN</th>
                  <th className="px-6 py-3 text-left border-b"></th>
                </tr>
              </thead>
              <tbody className="text-lg">
                {users.map((user) => (
                  <tr key={user._id} className="hover:scale-105 hover:font-bold transition-scale duration-500">
                    <td className="px-6 py-4 border-b">{user._id}</td>
                    <td className="px-6 py-4 border-b">
                      {editableUserId === user._id ? (
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full input input-bordered bg-gray-800 p-2 border rounded-lg text-white pr-10" // Adjust padding-right slightly
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-black hover:text-white transition-all duration-200 rounded-lg p-2"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {user.username}{" "}
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="ml-4 text-blue-400"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {editableUserId === user._id ? (
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full input input-bordered p-2 bg-gray-800 border rounded-lg text-white pr-10" // Adjusted padding-right
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-black hover:text-white transition-all duration-200 rounded-lg p-2"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <p>{user.email}</p>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="ml-4 text-blue-400"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td className="border-b">
                      {!user.isAdmin && (
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => openModal(user._id)}
                            className="btn btn-error text-white rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal content */}
            {isModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center z-50  bg-opacity-50">
                <div className="modal modal-open">
                  <div className="modal-box bg-[#434343] p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <h3 className="text-lg mb-6 text-white">Are you sure you want to delete this user?</h3>
                    <div className="flex justify-end space-x-4">
                      {/* Yes, Delete Button */}
                      <button
                        onClick={deleteHandler}
                        className="btn btn-error text-white px-6 py-3 rounded-lg"
                      >
                        Yes, delete
                      </button>
                      {/* Cancel Button */}
                      <button
                        onClick={closeModal}
                        className="btn bg-gray-800 border-none text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;
