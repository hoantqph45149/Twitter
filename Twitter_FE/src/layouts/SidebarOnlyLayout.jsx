import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";

export default function SidebarOnlyLayout() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
