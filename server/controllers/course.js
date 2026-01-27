import { Course } from "../models/Course.js";

//get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({
        path: "educator",
      });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to get all courses",
    });
  }
};

//get course by id
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const courseData = await Course.findById(id).populate({
      path: "educator",
    });

    //Remove lecture url if isPreview is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({
      success: true,
      courseData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to get all courses",
    });
  }
};
