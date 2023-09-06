import { useState } from "react";
import logo from "../assets/Avatar.jpg";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Header() {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <header className="w-full h-[4.5rem] md:px-[3.25rem] bg-[#fff] border-b border-b-[#EAECF0] ">
      <div className="h-full px-4 md:px-8 w-full flex justify-between items-center">
        <div className=" w-[6.25rem] mr-[2.625rem] flex-center py-1 pr-[33px] pl-[5px]">
          <h1 className="text-2xl leading-6 text-black font-bold font-['Inter']">
            ToDo
          </h1>
        </div>
        <nav className="hidden md:block">
          <div className="flex justify-between items-center space-x-4">
            <Icon
              icon="tabler:settings"
              fontSize={25}
              color="#667085"
              cursor="pointer"
            />
            <Icon
              icon="guidance:bell"
              fontSize={25}
              color="#667085"
              cursor="pointer"
              fontWeight={600}
            />
            <img
              src={logo}
              alt="avatar"
              className="w-10 h-10 rounded-full object-fill object-center"
            />
          </div>
        </nav>
        <div className="block md:hidden cursor-pointer" onClick={toggleMenu}>
          <Icon
            icon={!showMenu ? "ri:menu-2-line" : "fa6-solid:xmark"}
            fontSize={25}
            color="#667085"
            cursor="pointer"
          />
        </div>

        {showMenu && (
          <div className="md:hidden absolute top-[4.5rem] right-0 p-4 bg-white border border-gray-300 shadow-md rounded-lg">
            <nav className="flex items-center" onClick={toggleMenu}>
              <div className="flex w-full flex-col space-y-2">
                <div className="flex items-center gap-2 hover:bg-gray-200 rounded-md duration-500 cursor-pointer">
                  <Icon
                    icon="tabler:settings"
                    fontSize={25}
                    color="#667085"
                    cursor="pointer"
                  />
                  <p className="text-base font-semibold text-gray-500">
                    Settings
                  </p>
                </div>
                <div className="flex items-center gap-2 hover:bg-gray-200 rounded-md duration-500 cursor-pointer">
                <Icon
              icon="guidance:bell"
              fontSize={25}
              color="#667085"
              cursor="pointer"
              fontWeight={600}
            />
                  <p className="text-base font-semibold text-gray-500">
                    Notifications
                  </p>
                </div>
                <div className="flex items-center gap-2 hover:bg-gray-200 rounded-md duration-500 cursor-pointer">
                  <Icon
                    icon="ph:user-bold"
                    fontSize={25}
                    color="#667085"
                    cursor="pointer"
                  />
                  <p className="text-base font-semibold text-gray-500">
                    User
                  </p>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}