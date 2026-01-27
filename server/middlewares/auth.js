import { clerkClient } from "@clerk/express";

//middlewares

export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const res = await clerkClient.users.getUser(userId);

    if (res.publicMetadata.role !== "educator") {
      return res.json({
        success: false,
        message: "Unauthorised Acees",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
