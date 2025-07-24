import { Button } from "@/components/ui/button";
import { siteTabs } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/utils"

function Home() {

  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(isLoggedIn())
  const navigate = useNavigate();

  return (
    <div className="h-[90%] flex flex-row  flex-wrap items-center justify-center"> {/* Add a container for buttons with horizontal spacing */}


      {userLoggedIn ? siteTabs.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="relative flex-1 h-full p-2 text-3xl items-center justify-center font-semibold hover:scale-110 overflow-hidden transition delay-100 ease-in-out hover:shadow-2xl hover:backdrop-blur-sm"
          >
            {
              (item.name == "Movies")
                ? <img src="/movies.png" alt="movies" className="w-full h-full object-cover" />
                : ((item.name == "Books")
                  ? <img src="/books.jpeg" alt="music" className="w-full h-full object-none" />
                  : <img src="/music.jpg" alt="music" className="w-full h-full object-cover" />
                )
            }
            <p className="absolute items-center w-full bottom-1/2 left-1/3 text-6xl z-5 text-white ">
              {item.name}

            </p>
          </div>
        );
      })
        : <>
          {navigate('/auth/login')}
        </>
      }
    </div>
  );
}

export default Home;
