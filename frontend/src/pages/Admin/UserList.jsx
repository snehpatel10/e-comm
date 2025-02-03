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
      <div className="p-4">
        <h1 className=" pl-[8rem] text-2xl font-semibold mb-6 text-white">Users</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data.message || error.message}</Message>
        ) : (
          <div className="flex flex-col md:flex-row">
            <AdminMenu />
            <table className="w-full md:w-4/5 mx-auto table-auto border-collapse text-white">
              <thead>
                <tr className="text-xl">
                  <th className="px-6 py-3 text-left border-b">ID</th>
                  <th className="px-6 py-3 text-left border-b">NAME</th>
                  <th className="px-6 py-3 text-left border-b">EMAIL</th>
                  <th className="px-6 py-3 text-left border-b">ADMIN</th>
                  <th className="px-6 py-3 text-left border-b">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 border-b">{user._id}</td>
                    <td className="px-6 py-4 border-b">
                      {editableUserId === user._id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-gray-800 text-white"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
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
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg bg-gray-800 text-white"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
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
                    <td className="px-6 py-4 border-b">
                      {!user.isAdmin && (
                        <div className="flex justify-center items-center">
                          <button
                            onClick={() => openModal(user._id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
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
  
            {/* Flowbite Modal for Delete Confirmation */}
            {isModalOpen && (
              <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
                  <h3 className="text-xl font-semibold mb-6 text-white">Are you sure you want to delete this user?</h3>
                  <div className="flex justify-between">
                    <button
                      onClick={deleteHandler}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={closeModal}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
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
    );
  }
  
  export default UserList;
  
