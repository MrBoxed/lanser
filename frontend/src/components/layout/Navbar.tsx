import { Link, useNavigate } from "react-router-dom";
import { PRODUCT_NAME, siteTabs } from "../../utils/constants";
import type { TabType } from "../../utils/constants";
import { Menu, User } from "lucide-react";
import { useState } from "react";
import UploadNavButton from "./UploadNavButton";
import Drawer from "./Drawer";
import { Badge } from "../ui/badge";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

function NavBar() {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [uplaodBtnEnable, setUploadBtnEnable] = useState(true);
  const [currentTab, setCurrentTab] = useState(-1);

  function HandleTabs(e: React.MouseEvent<HTMLLIElement>, page: TabType, key: number) {
    navigate(page.path);
    setCurrentTab(key);
  }

  const isLoggedIn = localStorage.getItem("user") !== null;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <nav className="w-full h-fit max-h-15 flex gap-2 px-4 items-center sticky top-0 bg-black z-5">
      {/* HAMBURGER MENU FOR MOBILE */}
      <div className="lg:hidden hover:bg-white/30 rounded-full p-2">
        <div onClick={() => setOpenMenu(true)}>
          <Menu />
        </div>
      </div>

      {/* DRAWER */}
      <Drawer openMenu={openMenu} setOpen={setOpenMenu} />

      {/* LOGO */}
      <div
        onClick={() => navigate('/home')}
        className="flex items-center justify-center gap-4">
        <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent text-2xl font-bold cursor-default">
          {PRODUCT_NAME}
        </div>
      </div>

      {/* PAGE TABS */}
      <div className="hidden lg:block mx-6">
        <ul className="w-fit flex flex-wrap text-md mt-4 font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 z-1">
          {siteTabs.map((page, key) => (
            <li
              key={page.path}
              onClick={(e) => HandleTabs(e, page, key)}
              className="px-2"
            >
              <p
                className={`inline-block px-4 py-2 text-white rounded-t-lg dark:bg-gray-800 dark:text-blue-500 cursor-pointer
                  ${currentTab === key ? "bg-violet-700" : "bg-gray-900"}`}
              >
                {page.name}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-3">
        <UploadNavButton btnFunction={setUploadBtnEnable} />

        {!isLoggedIn ? (
          <div
            onClick={() => navigate("/auth/login")}
            className="text-white font-bold cursor-pointer border rounded-full px-4 py-2 hover:bg-violet-800"
          >
            Login
          </div>
        ) : (
          <ContextMenu>
            <ContextMenuTrigger>
              <Badge className="p-3 bg-white rounded-full cursor-pointer">
                <User size={28} color="black" />
              </Badge>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => navigate("/profile")}>Profile</ContextMenuItem>
              <ContextMenuItem onClick={handleLogout} className="text-red-500">
                Logout
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
