import { Outlet } from "react-router-dom";
import DarkModeSwitch from "../components/dark-mode-switch";

function Layout() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] px-4 pb-10 [@media(min-width:31.25rem)]:px-10">
      <header className="flex justify-end py-10">
        <DarkModeSwitch />
      </header>
      <Outlet />
    </div>
  );
}
export default Layout;
