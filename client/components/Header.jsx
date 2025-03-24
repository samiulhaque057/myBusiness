"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";
import { RiMenu2Line, RiMenu3Fill } from "react-icons/ri";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SideContent from "./SideContent";
import { useRouter } from "next/navigation";
import {
  useAuthLogoutMutation,
  useLoggedInUserQuery,
} from "@/features/auth/authApi";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Header({ showFull, setShowFull }) {
  const drawRef = useRef(null);
  const router = useRouter();

  const [logout] = useAuthLogoutMutation();

  const { data: { data: user = {} } = {} } = useLoggedInUserQuery();

  // handle Logout
  const handleLogout = () => {
    logout({})
      .then((res) => {
        Cookies.remove("accessToken");
        router.push("/login");
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="flex w-full justify-between items-center h-[60px] border-b px-4">
        <div
          className={`${
            showFull ? "-translate-x-[400px] w-0" : "translate-x-0 w-[260px]"
          } transition-all duration-500 hidden md:block`}
        >
          <Link href={"/"} className="logo font-semibold text-2xl">
            RI<span className="text-3xl text-green-500">Z</span>VI
          </Link>
        </div>

        <div className="flex items-center justify-between w-full flex-1">
          <span
            className="cursor-pointer p-2 hover:bg-black/5 rounded-sm hidden md:block"
            onClick={() => setShowFull(!showFull)}
          >
            {showFull ? <RiMenu2Line /> : <RiMenu3Fill />}
          </span>
          <span
            className="cursor-pointer p-2 hover:bg-black/5 rounded-sm block md:hidden"
            onClick={() => {
              setShowFull(!showFull);
              drawRef.current.click();
            }}
          >
            {showFull ? <RiMenu2Line /> : <RiMenu3Fill />}
          </span>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger>
                <Avatar className="ring-[3px] w-9 h-9">
                  <AvatarImage src="/user.png" />
                  <AvatarFallback>
                    {user?.name?.toUpperCase()?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-2 w-[200px]">
                <ul className="text-[14px] space-y-1 ">
                  <li className="px-2 py-1.5 rounded-md hover:bg-black/5 cursor-pointer">
                    <Link href={"/profile"}>Profile</Link>
                  </li>
                  <li className=" rounded-md hover:bg-black/5 cursor-pointer">
                    <button
                      className="px-2 py-1.5 w-full text-left"
                      onClick={() => handleLogout()}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>

            <div className="flex flex-col">
              <h4 className="text-sm font-semibold"> {user?.name} </h4>
              <p className="text-[11px]"> {user?.role} </p>
            </div>
          </div>
        </div>
      </div>
      {/* sheet  */}
      <Sheet>
        <SheetTrigger className="hidden" ref={drawRef}>
          Open
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="max-w-[300px] sm:max-w-[300px] text-left"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Are you absolutely sure?</SheetTitle>
          </SheetHeader>
          <SideContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
