"use client";
import Header from "@/components/Header";
import SideContent from "@/components/SideContent";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Template({ children }) {
  const [showFull, setShowFull] = useState(false);
  return (
    <>
      <Header setShowFull={setShowFull} showFull={showFull} />
      <main className="flex h-[calc(100vh-60px)]  overflow-hidden">
        <aside
          className={`${
            showFull
              ? "-translate-x-[400px] w-0"
              : "w-[260px] translate-x-0   h-full p-4"
          } transition-all duration-500 border-r  hidden md:block overflow-auto `}
        >
          <SideContent />
        </aside>
        <aside className="flex-1  overflow-auto">{children}</aside>
      </main>
    </>
  );
}
