import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "educator") {
        setIsEducator(true);
      }

      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  // Calculate average rating
  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;

    const total = course.courseRatings.reduce(
      (sum, item) => sum + item.rating,
      0,
    );

    return (total / course.courseRatings.length).toFixed(1);
  };

  // Calculate chapter time
  const calculateChapterTime = (chapter) => {
    if (!chapter?.chapterContent) return "0m";

    let time = 0;
    chapter.chapterContent.forEach(
      (lecture) => (time += lecture?.lectureDuration || 0),
    );

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate course duration
  const calculateCourseDuration = (course) => {
    if (!course?.courseContent) return "0m";

    let time = 0;

    course.courseContent.forEach((chapter) => {
      chapter?.chapterContent?.forEach((lecture) => {
        time += lecture?.lectureDuration || 0;
      });
    });

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate number of lectures
  const calculateNoOfLecture = (course) => {
    if (!course?.courseContent) return 0;

    let total = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        total += chapter.chapterContent.length;
      }
    });

    return total;
  };

  // Fetch enrolled courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setEnrolledCourses([...data.enrolledCourses].reverse());
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLecture,
    fetchUserEnrolledCourses,
    enrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
