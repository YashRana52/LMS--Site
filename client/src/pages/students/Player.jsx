import humanizeDuration from "humanize-duration";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import Youtube from "react-youtube";
import Footer from "../../components/students/Footer";
import Rating from "../../components/students/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/students/Loading";

function Player() {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        getCourseprogress();
        toast.success(data.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const getCourseprogress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getCourseprogress();
  }, []);

  useEffect(() => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    if (course) {
      setCourseData(course);

      course.courseRatings?.forEach((item) => {
        if (item.userId === userData?._id) {
          setInitialRating(item.rating);
        }
      });
    }
  }, [enrolledCourses, courseId, userData]);

  return courseData ? (
    <>
      <div className="min-h-screen bg-gray-50 px-4 sm:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT : Course Content */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>

            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className="border rounded mb-3 overflow-hidden">
                <div
                  onClick={() => toggleSection(index)}
                  className="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-100 hover:bg-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      className={`w-4 transition-transform ${
                        openSection[index] ? "rotate-180" : ""
                      }`}
                      alt=""
                    />
                    <p className="font-medium text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {chapter.chapterContent.length} lectures ·{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                {openSection[index] && (
                  <ul className="px-4 py-2 space-y-2">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {progressData?.lectureCompleted?.includes(
                            lecture._id,
                          ) ? (
                            <img
                              src={assets.blue_tick_icon}
                              className="w-4"
                              alt="completed"
                            />
                          ) : (
                            <img
                              src={assets.play_icon}
                              className="w-4"
                              alt=""
                            />
                          )}

                          <p className="text-gray-700">
                            {lecture.lectureTitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          {lecture.lectureUrl && (
                            <button
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  lectureId: lecture._id, // ✅ FIX
                                  chapter: index + 1,
                                  lecture: i + 1,
                                })
                              }
                              className="text-blue-600 hover:underline"
                            >
                              Watch
                            </button>
                          )}
                          <span className="text-gray-500">
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ["h", "m"] },
                            )}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div className="flex items-center gap-2 py-3 mt-10">
              <h1 className="text-xl font-bold">Rate this Course</h1>
              <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          </div>

          {/* RIGHT : Video Player */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            {playerData ? (
              <>
                <Youtube
                  videoId={playerData.lectureUrl.split("/").pop()}
                  iframeClassName="w-full aspect-video rounded"
                />

                <div className="mt-4 flex justify-between items-center">
                  <p className="font-medium">
                    {playerData.chapter}.{playerData.lecture}{" "}
                    {playerData.lectureTitle}
                  </p>

                  <button
                    onClick={() => markLectureAsCompleted(playerData.lectureId)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {progressData?.lectureCompleted?.includes(
                      playerData.lectureId,
                    )
                      ? "Completed"
                      : "Mark Completed"}
                  </button>
                </div>
              </>
            ) : (
              <img
                src={courseData.courseThumbnail}
                className="w-full rounded"
                alt=""
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    <Loading />
  );
}

export default Player;
