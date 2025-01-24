import LoginForm from "./pages/LoginPage";
import SignupForm from "./pages/SignupPage";
import UserDashBoardPage from "./pages/User.Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashBoardPage from "./pages/Admin.Dashboard";
import ModeratorDashBoardPage from "./pages/Moderator.Dashboard";
import ChartPage from "./pages/ChartPage";
import ModeratorDashboardCancelled from "./pages/Moderator.Dashboard.Cancelled";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ModeratorDashboardCompleted from "./pages/Moderator.Dashboard.Completed";
import ModeratorDashboardAssigne from "./pages/Moderator.Dashboard.Assign";
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<ChartPage />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/user/:id" element={<UserDashBoardPage />} />
            <Route path="/admin/:id" element={<AdminDashBoardPage />} />
            <Route path="/moderator/:id" element={<ModeratorDashBoardPage />}>
              <Route index element={<ModeratorDashboardAssigne />} />
              <Route
                path="complete"
                element={<ModeratorDashboardCompleted />}
              />
              <Route
                path="cancelled"
                element={<ModeratorDashboardCancelled />}
              />
            </Route>

            {/* Aur bhi protected routes add kar sakte hain */}
          </Route>
        </Routes>
      </Router>
      {/* <LoginForm />
      <SignupForm /> */}
    </ThemeProvider>
  );
}

export default App;
