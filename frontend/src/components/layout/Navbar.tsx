import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { PRODUCT_NAME, siteTabs } from "../../utils/constants";
import type { TabType } from "../../utils/constants";
import { Menu, User, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import UploadNavButton from "./UploadNavButton";
import Drawer from "./Drawer";
import { Badge } from "../ui/badge";
import { Input } from "@/components/ui/input";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const [openMenu, setOpenMenu] = useState(false);
  const [uplaodBtnEnable, setUploadBtnEnable] = useState(true);
  const [currentTab, setCurrentTab] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  function HandleTabs(e: React.MouseEvent<HTMLLIElement>, page: TabType, key: number) {
    navigate(page.path);
    setCurrentTab(key);
  }

  const isLoggedIn = localStorage.getItem("user") !== null;

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/auth/login");
    setShowUserMenu(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const currentPathname = location.pathname;
      let targetPath = '/movies'; // Default search target

      if (currentPathname.startsWith('/movies')) {
        targetPath = '/movies';
      } else if (currentPathname.startsWith('/music')) {
        targetPath = '/music';
      } else if (currentPathname.startsWith('/books')) {
        targetPath = '/books';
      } else {
        // If on homepage or other non-category page, default to movies search
        targetPath = '/movies';
      }

      // Navigate to the target path with the search query
      navigate(`${targetPath}?query=${encodeURIComponent(searchQuery.trim())}`);
      console.log(`Navigating to: ${targetPath}?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Effect to close the user menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className="w-full h-fit max-h-15 flex gap-2 px-4 items-center sticky top-0 bg-black text-white z-50 py-2">
      {/* HAMBURGER MENU FOR MOBILE */}
      <div className="lg:hidden hover:bg-white/30 rounded-full p-2 cursor-pointer">
        <div onClick={() => setOpenMenu(true)}>
          <Menu />
        </div>
      </div>

      {/* DRAWER */}
      <Drawer openMenu={openMenu} setOpen={setOpenMenu} />

      {/* LOGO */}
      <div
        onClick={() => navigate('/home')}
        className="flex items-center justify-center gap-4 cursor-pointer"
      >
        <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent text-2xl font-bold">
          {PRODUCT_NAME}
        </div>
      </div>

      {/* PAGE TABS */}
      <div className="hidden lg:block mx-6">
        <ul className="w-fit flex flex-wrap text-md mt-4 font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
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

      {/* SEARCH BAR */}
      <form onSubmit={handleSearch} className="flex-grow flex items-center max-w-md mx-4">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* RIGHT SIDE - Upload Button & User Menu */}
      <div className="ml-auto flex items-center gap-3">
        {/* Conditionally render UploadNavButton */}
        {isLoggedIn && <UploadNavButton btnFunction={setUploadBtnEnable} />}

        {!isLoggedIn ? (
          <div
            onClick={() => navigate("/auth/login")}
            className="text-white font-bold cursor-pointer border rounded-full px-4 py-2 hover:bg-violet-800 transition-colors duration-200"
          >
            Login
          </div>
        ) : (
          <div className="relative" ref={userMenuRef}>
            <Badge
              className="p-3 bg-white rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User size={28} color="black" />
            </Badge>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white border border-gray-700 rounded-md shadow-lg z-10">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 cursor-pointer rounded-t-md" onClick={() => setShowUserMenu(false)}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700 cursor-pointer rounded-b-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
