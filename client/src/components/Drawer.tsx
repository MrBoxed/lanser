import React, { SetStateAction, useState } from "react";
import { PRODUCT_NAME, siteTabs } from "../constants/constants";
import { Settings, X, Clapperboard, BookOpenText, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      className={`drawer-style 
                ${openMenu ? "translate-x-0" : "translate-x-[-100%]"}
                `}
    >
      <div className="w-full h-full flex flex-col p-4 gap-4">
        <button className="ml-auto rounded-full p-2" onClick={closeDrawer}>
          <X />
        </button>

        <div className="drawer-container">
          <div className="bg-logo-text">{PRODUCT_NAME}</div>
        </div>

        <ul className="drawer-container">
          {siteTabs.map((page) => (
            <div
              onClick={() => {
                closeDrawer();
                navigate(page.path);
                return;
              }}
              className="drawer-item"
            >
              {<page.image />}
              {page.name}
            </div>
          ))}
        </ul>

        <div className="drawer-item mt-auto">
          <Settings />
          Settings
        </div>
      </div>
    </div>
  );
}

export default Drawer;
