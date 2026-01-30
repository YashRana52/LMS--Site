import { clerkClient } from "@clerk/express";
import { Course } from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

//update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to update role",
    });
  }
};

//add new course

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail not attached",
      });
    }

    // Parse course data
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    // Upload image first
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    // Create course
    await Course.create(parsedCourseData);

    res.status(201).json({
      success: true,
      message: "Course added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add new course",
    });
  }
};

//get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to get educator courses",
    });
  }
};

//get data for educator dashboard(Total earning,Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    //calculate total earning from purchase
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0,
    );
    // collect unique enroll student id with their course title
    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl",
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to get dashboard data",
    });
  }
};

//get enroll student data with purchase data
export const getEnrolledStudentData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get enrolled student data",
    });
  }
};
