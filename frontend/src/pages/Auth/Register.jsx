import React, { useEffect, useState } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/userApiSlice";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      try {
        const res = await register({username, email, password}).unwrap()
        dispatch(setCredentials({...res}))
        navigate(redirect)
        toast.success('User successfully registered')
      } catch (error) {
        console.error(error)
        toast.error(error.data.message)
      }
    }

  };

  return (
    <section className="pl-[10rem] flex flex-wrap">
  <div className="mr-[4rem] mt-[4rem] w-full lg:w-[45%]">
    <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
    <form onSubmit={submitHandler} className="container w-[35rem]">
      <div className="my-[2rem]">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 p-2 border rounded w-[85%]"
          placeholder="Enter name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="my-[2rem]">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="mt-1 p-2 border rounded w-[85%]"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
        />
      </div>
      <div className="my-[2rem]">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 p-2 border rounded w-[85%]"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="my-[2rem]">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="mt-1 p-2 border rounded w-[85%]"
          placeholder="Enter name"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="mt-[2rem]">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem] hover:bg-pink-600"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
        {isLoading && <Loader />}
      </div>
    </form>
    <div className="mt-2 flex items-center gap-2">
      <p className="text-white"> Already have an account? </p>
      <Link
        to={redirect ? `/login?redirect=${redirect}` : "/login"}
        className="text-pink-500 hover:underline"
      >
        Login
      </Link>
    </div>
  </div>
  <div className="w-[45%] mt-[4rem] lg:mt-0">
    <img
      src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
      alt=""
      className="h-full w-full object-cover rounded-lg"
    />
  </div>
</section>


  );
}

export default Register;
