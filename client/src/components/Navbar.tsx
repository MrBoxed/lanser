import Movies from "../pages/movies/Movies";
import Music from "../pages/music/Music";
import Books from "../pages/books/Books";

import { Link, Links, useNavigate } from "react-router-dom";

import { PRODUCT_NAME, siteTabs } from "../constants/constants";
import { Menu, Upload } from "lucide-react";
import { useState } from "react";
import Drawer from "./Drawer";

function NavBar() {
  const navigate = useNavigate();

  // ::: For mobile drawer :::
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const openDrawer = () => setOpenMenu(true);

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
      <div className="hidden lg:block px-3 flex-3 flex gap-x-2 pt-2">
        <ul className="w-fit flex flex-wrap justify-start text-sm font-medium m-1 text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
          {siteTabs.map((page) => (
            <li className="me-2" key={page.path}>
              <a
                href={page.path}
                aria-current="page"
                className="inline-block px-4 py-2 bottom-0 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
              >
                {page.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* LOGIN / UPLOAD BUTTONS */}
      <div className="flex-1 flex gap-5 px-5 items-center justify-center">
        <button className="upload-btn" onClick={() => navigate("/upload")}>
          <Upload />
          upload
        </button>
        <div
          onClick={() => navigate("/login")}
          className="text-white font-bold cursor-pointer  p-2 hover:text-violet-300"
        >
          Login
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
