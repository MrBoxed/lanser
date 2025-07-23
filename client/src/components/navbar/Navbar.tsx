import Movies from "../../pages/movies/Movies";
import Music from "../../pages/music/Music";
import Books from "../../pages/books/Books";

import { Link, Links, useNavigate } from "react-router-dom";

import { PRODUCT_NAME, siteTabs, TabType } from "../../utils/constants";
import { Menu, Upload } from "lucide-react";
import { useState } from "react";
import Drawer from "../Drawer";
import LoginBtn from "./LoginBtn";
import HoverCardBtn from "../HoverCardBtn";
import UploadNavButton from "./UploadNavButton";

function NavBar() {
  const navigate = useNavigate();

  // ::: For mobile drawer :::
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [uplaodBtnEnable, setUploadBtnEnable] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<number>(0)

  const openDrawer = () => setOpenMenu(true);

  function HandleTabs(e: React.MouseEvent<HTMLLIElement, MouseEvent>, page: TabType, key: number) {
    navigate(page.path);
    setCurrentTab(key);
  }

  return (
    <nav className="navbar-style">

      {/* HAMBURBER FOR MOBILE */}
      <div className="lg:hidden hover:bg-white/30 rounded-full p-2">
        <div onClick={openDrawer}>
          <Menu />
        </div>
      </div>

      {/* DRAWER */}
      <Drawer openMenu={openMenu} setOpen={setOpenMenu} />

      {/*  MENU & NAME */}
      <div className="flex items-center justify-center gap-4">
        <div className="bg-logo-text">{PRODUCT_NAME}</div>
      </div>

      {/* TABS FOR DIFF WEBPAGES */}
      <div className="hidden lg:block mx-6">

        <ul className="w-fit flex flex-wrap text-md mt-4 font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 z-1">

          {siteTabs.map((page, key) => (
            <li
              key={page.path}
              onClick={(e) => HandleTabs(e, page, key)}
              className="px-2"
            >
              <text
                aria-current="page"
                className={`inline-block px-4 py-2 text-white  rounded-t-lg  dark:bg-gray-800 dark:text-blue-500 cursor-pointer
                  ${(currentTab == key) ? "bg-violet-700" : "bg-gray-900"}`}
              >
                {page.name}
              </text>
            </li>
          ))}
        </ul>
      </div>

      {/* LOGIN / UPLOAD BUTTONS */}

      <div className="flex grow gap-x-1 px-5  items-center justify-evenly">
        <div className="p-2 text-white">
          <UploadNavButton
            // showBtn={uplaodBtnEnable}
            btnFunction={setUploadBtnEnable} />
        </div>

        <div
          onClick={() => navigate("/movies")}
          className="text-white font-bold cursor-pointer p-2 border- rounded-full px-4 hover:bg-violet-800"
        >
          Login
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
