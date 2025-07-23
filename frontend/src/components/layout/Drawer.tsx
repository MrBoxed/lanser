import React, { useState } from "react";
import type { SetStateAction } from "react";

import { Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PRODUCT_NAME, siteTabs } from "@/utils/constants";

function Drawer({
  openMenu,
  setOpen,
}: {
  openMenu: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [openDrawer, setOpenDrawer] = useState<boolean>(openMenu);

  const closeDrawer = () => setOpen(false);
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white/20 backdrop-blur-lg shadow-2xl fixed top-0 left-0 w-2/3 md:w-1/3 lg:hidden h-screen rounded-r-xl transition-transform transform duration-500 z-50 
                ${openMenu ? "translate-x-0" : "translate-x-[-100%]"}
                `}
    >
      <div className="w-full h-full flex flex-col p-4 gap-4">
        <button className="ml-auto rounded-full p-2" onClick={closeDrawer}>
          <X />
        </button>

        <div className="w-full bg-white/10 flex flex-col gap-5 rounded-xl p-4">
          <div className="bg-logo-text">{PRODUCT_NAME}</div>
        </div>

        <ul className="w-full bg-white/10 flex flex-col gap-5 rounded-xl p-4">
          {siteTabs.map((page) => (
            <div
              onClick={(e) => {
                closeDrawer();
                e.preventDefault();
                navigate(page.path);
                return;
              }}
              className="w-full bg-white/20 rounded-xl px-4 py-2 font-bold hover:bg-white/10 flex flex-row gap-4 items-center cursor-pointer"
            >
              {<page.image />}
              {page.name}
            </div>
          ))}
        </ul>

        <div className="w-full bg-white/20 rounded-xl px-4 py-2 font-bold hover:bg-white/10 flex flex-row gap-4 items-center cursor-pointer mt-auto">
          <Settings />
          Settings
        </div>
      </div>
    </div>
  );
}

export default Drawer;
