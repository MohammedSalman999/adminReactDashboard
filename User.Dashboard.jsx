"use client"; // Yeh line ensure karti hai ki React components sirf client-side pe render ho.

import * as XLXS from "xlsx";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Navigation handle karne ke liye hook import kiya.
import axios from "axios"; // Backend se data fetch karne ke liye axios use ho raha hai.
import { motion } from "framer-motion"; // Motion animations add karne ke liye Framer Motion ka use ho raha hai.
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { ModeToggle } from "@/components/mode-toggle"; // Light aur dark mode toggle ke liye reusable component.
import { AppSidebar } from "@/components/sidebar/app-sidebar"; // Sidebar ka design aur logic handle karne wala component.

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"; // Sidebar ko trigger aur manage karne ke liye UI components.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Cards ke liye reusable components import kiye.
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Table aur uske related sub-components ke liye import.
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Pagination UI components ke liye import.
import TailwindLoadingSpinner from "@/components/TailwindLoadingSpinner";

import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormMessage,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskDescriptionSchema } from "@/schemas/taskDescription";
// Sabse pehle, hum Framer Motion ke variants ko define karenge

// Ye variants cards ke liye hain
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

// Ye variants table rows ke liye hain
// const tableRowVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.3 },
//   },
// };

const AnimatedNumber = ({ value }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 30 }} // Animation start hoti hai transparency aur downward offset se.
      animate={{ opacity: 1, y: 0 }} // Animation end hoti hai full opacity aur normal position pe.
      transition={{ duration: 0.5 }} // Animation duration 0.5 seconds hai.
    >
      {value}
    </motion.span>
  );
};

export default function UserDashBoardPage() {
  const form = useForm({
    resolver: zodResolver(taskDescriptionSchema),
    defaultValues: {
      taskDetails: "",
      photo1: null,
      photo2: null,
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskData, setTaskData] = useState(null); // Task data store karne ke liye state banayi.
  const [currentPage, setCurrentPage] = useState(1); // Current page ka tracking.
  const [selectedTask, setSelectedTask] = useState(null); // Selected task store karne ke liye state.
  // const [taskDetails, setTaskDetails] = useState("");
  // const [photo1, setPhoto1] = useState(null);
  // const [photo2, setPhoto2] = useState(null);
  const tasksPerPage = 5; // Ek page par 5 tasks display karne ka decision liya gaya.

  const navigate = useNavigate(); // Navigation ko handle karne ke liye hook use kiya.
  const fetchTaskData = useCallback(async () => {
    const storedUser = localStorage.getItem("user"); // User details fetch ki local storage se.
    const accessToken = localStorage.getItem("accessToken"); // Token bhi local storage se fetch kiya.

    if (!storedUser || !accessToken) {
      navigate("/login"); // Agar user ya token nahi mila toh login page pe bhej diya.
      return;
    }

    const user = JSON.parse(storedUser); // Local storage ka user JSON format me parse kiya.

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization header add kiya.
          },
        }
      );
      if (response.data && response.data.tasks) {
        console.log(response.data);
        setTaskData(response.data); // Data ko state me set kar diya.
      } else {
        console.error("Task data ka format expected format se alag hai");
      }
    } catch (error) {
      console.error("Oops! Task data lane mein kuch gadbad ho gayi:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user"); // Unauthorized user ke liye cleanup.
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    }
  }, [navigate]); // Dependency array me sirf navigate hai kyunki wo re-render ko trigger karega.

  useEffect(() => {
    fetchTaskData(); // Component mount hote hi data fetch karte hain.
    const interval = setInterval(fetchTaskData, 30000); // Har 30 seconds me data auto-refresh.
    return () => clearInterval(interval); // Cleanup to prevent memory leaks.
  }, [fetchTaskData]);

  if (!taskData) {
    return <TailwindLoadingSpinner message="Preapairing User's Dashboard..." />;
  }

  const closeDialog = () => {
    setIsDialogOpen(false); // Dialog close karne ke liye.
    setSelectedTask(null); // Selected task ko reset karte hain.
    // setTaskDetails(""); // Task details ko reset karte hain.
  };

  const onSubmit = async (data) => {
    console.log("ID", setSelectedTask.id);
    console.log("Details:", data.taskDetails);
    console.log("Photo 1:", data.photo1);
    console.log("Photo 2:", data.photo2);
    const accessToken = localStorage.getItem("accessToken");

    // Create a new FormData object to send files and details
    const formData = new FormData();

    formData.append("taskDetails", data.taskDetails);
    formData.append("photo1", data.photo1); // Append the first photo
    formData.append("photo2", data.photo2); // Append the second photo
    try {
      // Send the FormData object as the body of the request
      await axios.post(
        `http://localhost:5000/api/tasks/${taskId}/${action}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper content type for file upload
            Authorization: `Bearer ${accessToken}`, // Secure API call with token
          },
        }
      );

      await fetchTaskData(); // Refresh data after action
      setIsDialogOpen(false); // Close the dialog after action is completed
    } catch (error) {
      // Enhanced error logging
      console.error("Error details:", error);
      if (error.response) {
        // If the error has a response (like 4xx or 5xx error)
        console.error("Response Error Data:", error.response.data);
        console.error("Response Error Status:", error.response.status);
      } else if (error.request) {
        // If no response was received (network issues, etc.)
        console.error("Request Error Data:", error.request);
      } else {
        // Any other errors that occurred in setting up the request
        console.error("General Error:", error.message);
      }
    }
  };

  if (!taskData) {
    return <TailwindLoadingSpinner message="Loading Task Data..." />; // Agar data nahi hai toh loading state dikhate hain.
  }

  // download excel file
  const downloadExcel = () => {
    const tabledata = taskData.tasks.map((task) => ({
      "Vehicle No": task.vehicle_number,
      "Owner Name": task.owner_name,
      Contact: task.owner_phone,
      Status: task.status,
      City: task.city,
      Date: new Date(task.createdAt).toLocaleDateString(),
    }));

    // new book banayi
    const wb = XLXS.utils.book_new();
    // data add kiya
    const ws = XLXS.utils.json_to_sheet(tabledata);
    // sheet append ki
    XLXS.utils.book_append_sheet(wb, ws, "Tasks");
    // fs ke write file ka use karke download karwa li file
    XLXS.writeFile(wb, "Tasks.xlsx");
  };

  return (
    <SidebarProvider>
      <AppSidebar /> {/* Sidebar render kiya */}
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="mx-3 mt-2 rounded-lg border-b bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex h-12 items-center px-4">
              <SidebarTrigger className="mr-2" />
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 space-y-5 p-3">
            <motion.div
              className="grid gap-6 md:grid-cols-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">
                      Total Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.total} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">
                      Pending Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.pending} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card className="bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">
                      Finished Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.completed} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={cardVariants}>
                <Card
                  className="bg-gradient-to-br from-red-400 to-red-700
                 shadow-lg"
                >
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-white">
                      Cancelled Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">
                      <AnimatedNumber value={taskData.tasksSummary.cancelled} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <div className="space-y-4 ">
              {/* Pagination area and download button  */}
              <div className="flex  ">
                <Button
                  className=" justify self-start "
                  onClick={downloadExcel}
                >
                  Download
                </Button>
                <Pagination className="justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {[
                      ...Array(Math.ceil(taskData.tasks.length / tasksPerPage)),
                    ].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              Math.ceil(taskData.tasks.length / tasksPerPage)
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(taskData.tasks.length / tasksPerPage)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                <Table>
                  {/* Table Header */}
                  <TableHeader>
                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                      {[
                        "Vehicle No",
                        "Owner Name",
                        "Contact",
                        "Status",
                        "City",
                        "Date",
                        "Actions",
                      ].map((heading) => (
                        <TableHead
                          key={heading}
                          className="font-bold text-gray-700 dark:text-gray-300 px-4 py-2"
                        >
                          {heading}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  {/* Table Body with Animation */}
                  <motion.tbody
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: { staggerChildren: 0.05 },
                      },
                    }}
                  >
                    {taskData &&
                      taskData.tasks
                        .slice(
                          (currentPage - 1) * tasksPerPage,
                          currentPage * tasksPerPage
                        )
                        .map((task) => (
                          <motion.tr
                            key={task._id}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <TableCell className="font-medium text-gray-900 dark:text-gray-100 px-4 py-auto">
                              {task.vehicle_number}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-auto">
                              {task.owner_name}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-auto">
                              {task.owner_phone}
                            </TableCell>
                            <TableCell className="px-4 py-auto">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold bg-clip-text text-transparent ${
                                  task.status === "completed"
                                    ? "bg-gradient-to-br from-green-400 to-emerald-600"
                                    : task.status === "pending"
                                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                    : "bg-gradient-to-br from-red-400 to-red-700"
                                }`}
                              >
                                {task.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-3">
                              {task.city}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300 px-4 py-3">
                              {new Date(task.createdAt).toLocaleDateString()}
                            </TableCell>

                            <TableCell className="px-4 py-2">
                              {task.status === "pending" ? (
                                <Popover>
                                  <PopoverTrigger className="font-semibold hover:underline text-blue-500">
                                    Select Action
                                  </PopoverTrigger>
                                  <PopoverContent className="flex justify-between w-56">
                                    <Button
                                      onClick={() => {
                                        setSelectedTask(task); // Select the task
                                        setIsDialogOpen(true); // Open dialog
                                      }}
                                      className="px-4 py-2 rounded-lg"
                                    >
                                      Complete
                                    </Button>

                                    {/* Dialog Content */}
                                    {isDialogOpen && selectedTask && (
                                      <Dialog
                                        open={isDialogOpen}
                                        onClose={closeDialog}
                                      >
                                        <DialogContent className="w-96 rounded-xl shadow-lg bg-white">
                                          <DialogHeader>
                                            <DialogTitle className="text-center text-2xl font-semibold text-gray-800">
                                              Task Description
                                            </DialogTitle>
                                            <DialogDescription></DialogDescription>
                                          </DialogHeader>
                                          <div className="flex flex-col p-2">
                                            {/* Vehicle Number */}
                                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                                              <label className="text-sm font-semibold text-gray-700">
                                                Vehicle Number:
                                              </label>
                                              <p className="text-sm text-gray-800">
                                                {task.vehicle_number}
                                              </p>
                                            </div>

                                            {/* Owner Name */}
                                            <div className="flex justify-between items-center bg-gray-50 p-3 mt-2 rounded-lg shadow-sm">
                                              <label className="text-sm font-semibold text-gray-700">
                                                Owner Name:
                                              </label>
                                              <p className="text-sm text-gray-800">
                                                {task.owner_name}
                                              </p>
                                            </div>

                                            {/* Contact */}
                                            <div className="flex justify-between items-center bg-gray-50 p-3 mt-2 rounded-lg shadow-sm">
                                              <label className="text-sm font-semibold text-gray-700">
                                                Contact:
                                              </label>
                                              <p className="text-sm text-gray-800">
                                                {task.owner_phone}
                                              </p>
                                            </div>
                                          </div>
                                          <Form {...form}>
                                            <form
                                              onSubmit={form.handleSubmit(
                                                onSubmit
                                              )}
                                            >
                                              {/* Task Details */}
                                              <FormField
                                                control={form.control}
                                                name="taskDetails"
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormLabel>
                                                      Task Details
                                                    </FormLabel>
                                                    <FormControl>
                                                      <textarea
                                                        {...field}
                                                        placeholder="Enter additional details"
                                                        className="w-full p-3 text-black border border-gray-300 rounded-lg"
                                                        rows="4"
                                                      />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                )}
                                              />

                                              {/* Photo 1 */}
                                              <FormField
                                                control={form.control}
                                                name="photo1"
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormLabel>
                                                      Upload Photo 1
                                                    </FormLabel>
                                                    <FormControl>
                                                      <input
                                                        type="file"
                                                        onChange={(e) =>
                                                          field.onChange(
                                                            e.target.files[0]
                                                          )
                                                        }
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                      />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                )}
                                              />

                                              {/* Photo 2 */}
                                              <FormField
                                                control={form.control}
                                                name="photo2"
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormLabel>
                                                      Upload Photo 2
                                                    </FormLabel>
                                                    <FormControl>
                                                      <input
                                                        type="file"
                                                        onChange={(e) =>
                                                          field.onChange(
                                                            e.target.files[0]
                                                          )
                                                        }
                                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                                      />
                                                    </FormControl>
                                                    <FormMessage />
                                                  </FormItem>
                                                )}
                                              />

                                              {/* Submit Button */}
                                              <button
                                                type="submit"
                                                className="px-5 py-2 bg-blue-600 text-white rounded-lg mt-4"
                                              >
                                                Submit
                                              </button>
                                            </form>
                                          </Form>
                                        </DialogContent>
                                      </Dialog>
                                    )}

                                    {/* Cancel Action Button */}
                                    <Button
                                      // Uncomment and implement cancel functionality if needed
                                      // onClick={() => handleTaskAction(task._id, "cancel")}
                                      className="px-4 py-2 rounded-lg"
                                    >
                                      Cancel
                                    </Button>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <span className="text-gray-500 cursor-not-allowed">
                                  No Actions
                                </span>
                              )}
                            </TableCell>
                          </motion.tr>
                        ))}
                  </motion.tbody>
                </Table>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
