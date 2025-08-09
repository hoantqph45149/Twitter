import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import SidebarOnlyLayout from "./layouts/SidebarOnlyLayout";

import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import MessagePage from "./pages/message/MessagePage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.error || !res.ok) throw new Error(data.error || "Error");
      return data;
    },
    retry: false,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Layout có Sidebar + RightPanel */}
        {authUser && (
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>
        )}

        {/* Layout chỉ có Sidebar */}
        {authUser && (
          <Route element={<SidebarOnlyLayout />}>
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/messages" element={<MessagePage />} />
          </Route>
        )}

        {/* Layout không có gì (auth pages) */}
        {!authUser && (
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={authUser ? "/" : "/login"} replace />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
