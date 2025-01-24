import asyncHandler from "../utils/asyncHandler.js";
import Task from "../models/taskModels.js";
import uploadOnCloudinary from "../utils/cloudinaryConfig.js";

// Complete a task

export const completeTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Get the local path of the uploaded avatar
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return res.status(400).json({
      message: "Image file is required",
    });
  }

  // Upload avatar to Cloudinary
  const photo1 = await uploadOnCloudinary(avatarLocalPath);
  if (!photo1 || !photo1.secure_url) {
    console.error("Cloudinary upload failed");
    return res.status(500).json({
      message: "Failed to upload avatar",
    });
  }

  task.status = "completed";
  task.photo1 = photo1.secure_url; // Save the photo paths in task

  await task.save();

  res.status(200).json({ message: "Task marked as complete", task });
});

// Reject a task
export const cancelTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;

  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  // Get the local path of the uploaded avatar
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return res.status(400).json({
      message: "Image file is required",
    });
  }

  // Upload avatar to Cloudinary
  const photo1 = await uploadOnCloudinary(avatarLocalPath);
  if (!photo1 || !photo1.secure_url) {
    console.error("Cloudinary upload failed");
    return res.status(500).json({
      message: "Failed to upload avatar",
    });
  }
  task.status = "cancelled";
  task.photo1 = photo1.secure_url; // Save the photo paths in task
  await task.save();

  res.status(200).json({ message: "Task cancelled", task });
});

export const CompletedTasks = asyncHandler(async (req, res) => {
  try {
    const completedTasks = await Task.find({ status: "completed" });
    res.status(200).json({
      message: "Completed Tasks fetched successfully",
      completedTasks,
    });
  } catch (error) {
    console.error("Error in completed task fetch :", error);
  }
});

export const CancelledTasks = asyncHandler(async (req, res) => {
  try {
    const cancelledTasks = await Task.find({ status: "cancelled" });
    res.status(200).json({
      message: "Cancelled tasks Fetched successfully",
      cancelledTasks,
    });
  } catch (error) {
    console.error("Error in fetching cancelled tasks ", error);
  }
});
