import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/userModels.js";
import Task from "../models/taskModels.js";

// Fetch users by city
export const getUserByCity = asyncHandler(async (req, res) => {
  const { city } = req.query;

  const users = await User.find({ city, role: "user" });
  if (users.length === 0) {
    return res.status(404).json({ message: "No users found in this city" });
  }
  console.log(users);
  res.status(200).json({ message: "Users fetched successfully", users });
});

// Assign a task to a specific user
export const assignTaskToUser = asyncHandler(async (req, res) => {
  const { city, name, status, taskDetails } = req.body;

  // Step 1: Validate task details
  const { vehicle_number, owner_name, owner_phone } = taskDetails || {};
  if (!vehicle_number || !owner_name || !owner_phone) {
    return res.status(400).json({ message: "Task details are required" });
  }

  // Ensure city and name are strings, not arrays

  // Step 2: Find user by city and name
  const user = await User.findOne({ city, name: name });
  if (!user) {
    return res.status(404).json({ message: "User not found in this city" });
  }

  // Step 3: Assign task
  const task = await Task.create({
    vehicle_number,
    owner_name,
    owner_phone,
    status,
    assignedTo: user._id,
    name: user.name,
    city,
  });

  res.status(201).json({ message: "Task assigned successfully", task });
});
