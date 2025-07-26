import React, { useState, useEffect } from "react";
import type { SetStateAction } from "react";

import { X } from "lucide-react"; // Removed Settings icon
import { useNavigate } from "react-router-dom";
import { PRODUCT_NAME, siteTabs } from "@/utils/constants";

function Drawer({
  openMenu,
  setOpen,
}: {
  openMenu: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  // openDrawer state is redundant as openMenu directly controls visibility
  // const [openDrawer, setOpenDrawer] = useState<boolean>(openMenu);

  const closeDrawer = () => setOpen(false);
  const navigate = useNavigate();

  // Effect to handle body scroll lock when drawer is open
  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = ''; // Allow scrolling
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [openMenu]);

  return (
    <>
      {/* Overlay for when the drawer is open */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeDrawer} // Close drawer when clicking outside
        />
      )}

      {/* Drawer Container */}
      <div
        className={`bg-gray-900/80 backdrop-blur-xl shadow-2xl fixed top-0 left-0
                    w-64 sm:w-72 lg:hidden h-screen rounded-r-2xl
                    transition-transform transform duration-500 ease-in-out z-50
                    ${openMenu ? "translate-x-0" : "translate-x-[-100%]"}
                   `}
      >
        <div className="w-full h-full flex flex-col p-6 gap-6 text-white"> {/* Increased padding and gap */}
          {/* Close Button */}
          <button
            className="ml-auto rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            onClick={closeDrawer}
          >
            <X size={24} /> {/* Increased icon size */}
          </button>

          {/* Logo / Product Name */}
          <div className="w-full flex flex-col items-center justify-center gap-4 py-4 border-b border-gray-700"> {/* Added border-b */}
            <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent text-3xl font-extrabold text-center">
              {PRODUCT_NAME}
            </div>
          </div>

          {/* Navigation Tabs */}
          <ul className="w-full flex flex-col gap-3"> {/* Adjusted gap */}
            {siteTabs.map((page) => (
              <li
                key={page.path}
                onClick={(e) => {
                  closeDrawer();
                  e.preventDefault();
                  navigate(page.path);
                }}
                className="w-full bg-gray-800/50 rounded-lg px-4 py-3 font-semibold
                           hover:bg-gray-700/70 transition-all duration-200
                           flex flex-row gap-4 items-center cursor-pointer text-lg" // Increased padding, font size
              >
                {<page.image size={20} className="text-gray-300" />} {/* Pass size prop to icon, adjusted color */}
                {page.name}
              </li>
            ))}
          </ul>

          {/* Removed Settings Section */}
          {/* The div for settings is removed as requested */}

        </div>
      </div>
    </>
  );
}

export default Drawer;
