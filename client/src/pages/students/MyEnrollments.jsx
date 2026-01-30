import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import Footer from "../../components/students/Footer";
import { toast } from "react-toastify";
import axios from "axios";

function MyEnrollments() {
  const {
    enrolledCourses = [],
    calculateCourseDuration,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [progressArray, setprogressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const totalLecture = calculateNoOfLecture(course);
          const lectureCompleted = data?.progressData
            ? data.progressData.lectureCompleted.length
            : 0;

          return {
            totalLecture,
            lectureCompleted,
          };
        }),
      );

      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        <table className="md:table-auto table-fixed w-full border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr className="text-gray-500">
              <th className="px-4 py-3 font-bold">Course</th>
              <th className="px-4 py-3 font-bold">Duration</th>
              <th className="px-4 py-3 font-bold">Completed</th>
              <th className="px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>

          <tbody>
            {enrolledCourses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No enrolled courses yet
                </td>
              </tr>
            ) : (
              enrolledCourses.map((course, index) => {
                const progress = progressArray[index];
                const isCompleted =
                  progress &&
                  progress.lectureCompleted === progress.totalLecture;

                return (
                  <tr
                    key={course._id || index}
                    className="border-b border-gray-500/20"
                  >
                    {/* Course */}
                    <td className="md:px-4 pl-2 md:pl-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-14 sm:w-24 md:w-28 rounded"
                        />
                        <p className="max-sm:text-sm">{course.courseTitle}</p>
                        <Line
                          strokeWidth={2}
                          percent={
                            progressArray[index]
                              ? (progressArray[index].lectureCompleted * 100) /
                                progressArray[index].totalLecture
                              : 0
                          }
                          className="bg-gray-300 rounded-full"
                        />
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-4 py-4 max-sm:hidden">
                      {calculateCourseDuration(course)}
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-4 max-sm:hidden">
                      {progress && (
                        <>
                          {progress.lectureCompleted}/{progress.totalLecture}{" "}
                          <span className="text-gray-500">Lectures</span>
                        </>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 max-sm:text-right">
                      <button
                        onClick={() => navigate(`/player/${course._id}`)}
                        className={`px-3 py-1 text-xs rounded cursor-pointer ${
                          isCompleted
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {isCompleted ? "Completed" : "On Going"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

export default MyEnrollments;
