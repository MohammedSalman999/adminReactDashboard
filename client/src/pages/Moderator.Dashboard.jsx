"use client"; // Yeh line ensure karti hai ki React components sirf client-side pe render ho.

import { Link, Outlet, useLocation } from "react-router-dom";
import { Clipboard, BookX, BookCheck } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarContent,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"; // Tooltip component for hover labels

import { useEffect, useState } from "react";

export default function ModeratorDashBoardPage() {
  const [showModeratorTasks, setShowModeratorTask] = useState(false);
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  useEffect(() => {
    setShowModeratorTask(
      location.pathname.includes("complete") ||
        location.pathname.includes("cancelled")
    );
  }, [location]);

  return (
    <SidebarProvider>
      <AppSidebar>
        <SidebarContent>
          {showModeratorTasks && (
            <SidebarGroup>
              <SidebarGroupLabel>Moderator Tasks</SidebarGroupLabel>
              {/* Assign Tasks Button with Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton className="hover:bg-blue-400" asChild>
                    <Link
                      className="w-full flex items-center"
                      to={`/moderator/${user.id}`}
                    >
                      <Clipboard className="text-blue-600" />
                      <span>Assign Tasks</span>{" "}
                      {/* Screen reader accessibility */}
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <span>Assign Tasks</span>
                </TooltipContent>
              </Tooltip>
            </SidebarGroup>
          )}
          <SidebarGroup>
            <SidebarGroupLabel>View Tasks</SidebarGroupLabel>

            {/* Completed Tasks Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton className="hover:bg-green-400" asChild>
                  <Link className="w-full flex items-center" to="complete">
                    <BookCheck className="text-green-600" />
                    <span>Completed Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Completed Tasks</span>
              </TooltipContent>
            </Tooltip>

            {/* Cancelled Tasks Button with Tooltip */}
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton className="hover:bg-orange-400" asChild>
                  <Link className="w-full flex items-center" to="cancelled">
                    <BookX className="text-orange-600 h-6 w-6" />
                    <span>Cancelled Tasks</span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Cancelled Tasks</span>
              </TooltipContent>
            </Tooltip>
          </SidebarGroup>
        </SidebarContent>
      </AppSidebar>

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
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
