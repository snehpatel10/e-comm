import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/userApiSlice";
import { FaTrashAlt } from 'react-icons/fa';
import { logout } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState("");
  const [error, setError] = useState(""); // State for handling errors

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match"); // Set error message here
      return;
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (error) {
        setError(error?.data?.message || error.message); // Handle errors here
      }
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (confirmUsername !== userInfo.username) {
      setError("Username does not match. Please try again."); // Display error if username doesn't match
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/users/delete/${userInfo._id}`, { withCredentials: true });
      toast.success("Account deleted successfully");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error during account deletion:", error);
      setError(error.response?.data?.message || error.message || 'An unexpected error occurred'); // Handle deletion errors
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[2rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-9">Update Profile</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow text-white"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow text-white"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="password"
                  className="grow text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </label>
            </div>
            <div className="mb-6">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="password"
                  className="grow text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </label>
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-500 btn text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                Update
              </button>
              <Link
                to="/user-orders"
                className="bg-pink-600 btn text-white py-2 px-4 rounded hover:bg-pink-700"
              >
                My orders
              </Link>
            </div>
          </form>

          {!userInfo.isAdmin && (
            <div className="mt-6 w-full">
              <button
                className="bg-red-500 btn text-white w-full mx-auto rounded hover:bg-red-600 flex items-center justify-center gap-2"
                onClick={() => setModalOpen(true)}
              >
                <FaTrashAlt className="h-5 w-5" />
                Delete Account
              </button>
            </div>
          )}
        </div>

        {loadingUpdateProfile && <Loader />}

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal modal-open">
              <div className="modal-box bg-white/30 backdrop-blur-md">
                <h3 className="text-xl font-semibold mb-4">Confirm Account Deletion</h3>
                <p className="mb-4">Please enter your <span className="font-extrabold">username</span> to confirm account deletion.</p>
                <input
                  type="text"
                  className="input input-bordered w-full mb-2 text-white"
                  value={confirmUsername}
                  onChange={(e) => setConfirmUsername(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mt-0 font-bold">{error}</p>} 
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="btn btn-error text-white py-2 px-4 rounded hover:bg-red-600 border-none"
                    onClick={handleDeleteAccount}
                  >
                    Confirm
                  </button>
                  <button
                    className="btn bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 border-none"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
