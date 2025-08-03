import Sidebar from "../components/common/Sidebar";
import RightPanel from "../components/common/RightPanel";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
      <RightPanel />
    </div>
  );
}
