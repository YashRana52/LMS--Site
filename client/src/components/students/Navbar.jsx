import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const { isEducator, navigate, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? "bg-white" : "bg-cyan-100/70"}`}
    >
      <Link to={"/"}>
        <img
          src={assets.logo}
          alt="logo"
          className="w-28 lg:w-32 cursor-pointer"
        />
      </Link>
      <di v className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button className="cursor-pointer" onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : " Become Educator"}
              </button>{" "}
              | <Link to={"/my-enrollments"}>My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </di>
      {/* phone screen */}
      <div className="md:hidden flex items-center gap-3 text-gray-600">
        <div className="flex flex-col text-sm">
          {user && (
            <>
              {" "}
              <button
                className="hover:text-gray-500 transition cursor-pointer"
                onClick={becomeEducator}
              >
                {isEducator ? "Educator Dashboard" : " Become Educator"}
              </button>{" "}
              <span className="h-px w-full bg-gray-300 my-1"></span>
              <Link
                to="/my-enrollments"
                className="hover:text-gray-800 transition "
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()} className="shrink-0">
            <img
              src={assets.user_icon}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
