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

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDeleteUser = async () => {
    try {
      if (userToDelete) {
        await deleteUser(userToDelete);
        toast.success("User deleted successfully");
        setIsModalOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "Something went wrong");
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error?.error || "Update failed");
    }
  };

  const handleToggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const handleOpenModal = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="flex">
      <div className="z-20">
        <AdminMenu />
      </div>

      <div className="p-6 w-full mt-[4rem]  rounded-lg">
        <h1 className="text-3xl font-semibold mb-6 text-white">Users</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error?.message}</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-white">
              <thead className="bg-[#333333]">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">NAME</th>
                  <th className="px-6 py-3 text-left">EMAIL</th>
                  <th className="px-6 py-3 text-left">ADMIN</th>
                  <th className="px-6 py-3 text-left">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#333333] transition-all duration-300">
                    <td className="px-6 py-4 border-b">{user._id}</td>
                    <td className="px-6 py-4 border-b">
                      {editableUserId === user._id ? (
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full input input-bordered bg-gray-700 p-2 border rounded-lg text-white pr-10"
                          />
                          <button
                            onClick={() => handleUpdateUser(user._id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-black rounded-lg p-2"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {user.username}
                          <button
                            onClick={() => handleToggleEdit(user._id, user.username, user.email)}
                            className="ml-2 text-blue-400 hover:text-blue-600 transition-colors"
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
                            className="w-full input input-bordered bg-gray-700 p-2 border rounded-lg text-white pr-10"
                          />
                          <button
                            onClick={() => handleUpdateUser(user._id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-black rounded-lg p-2"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {user.email}
                          <button
                            onClick={() => handleToggleEdit(user._id, user.username, user.email)}
                            className="ml-2 text-blue-400 hover:text-blue-600 transition-colors"
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
                    <td className="px-6 py-4 border-b">
                      {!user.isAdmin && (
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => handleOpenModal(user._id)}
                            className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-all duration-200"
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
            {isModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-black">
                <div className="modal-box bg-[#434343] p-8 rounded-lg shadow-lg max-w-sm w-full">
                  <h3 className="text-lg mb-6 text-white">Are you sure you want to delete this user?</h3>
                  <div className="flex justify-between space-x-4">
                    <button
                      onClick={handleDeleteUser}
                      className="btn btn-error text-white px-6 py-3 rounded-lg"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="btn bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
