import { GiClothes, GiRolledCloth } from "react-icons/gi";
import {
  MdAdminPanelSettings,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";
import { CiMemoPad } from "react-icons/ci";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { TiHomeOutline } from "react-icons/ti";
import { ImProfile } from "react-icons/im";
import { BiCheckSquare } from "react-icons/bi";

export default function SideContent() {
  const pathname = usePathname();

  return (
    <div>
      <ul className="space-y-1">
        <li
          className={`${
            pathname === "/"
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/" className="flex gap-3 items-center">
            <TiHomeOutline />
            <span>Home</span>
          </Link>
        </li>
        <li
          className={`${
            pathname.includes("/memo")
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/memo" className="flex gap-3 items-center">
            <CiMemoPad />
            <span>Memo</span>
          </Link>
        </li>
        <li
          className={`${
            pathname.includes("/grays/")
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/grays/all" className="flex gap-3 items-center">
            <GiRolledCloth />
            <span>Grays</span>
          </Link>
        </li>
        <li
          className={`${
            pathname.includes("/dyeings/all")
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/dyeings/all" className="flex gap-3 items-center">
            <GiClothes />
            <span>Dyeings</span>
          </Link>
        </li>
        <li
          className={`${
            pathname.includes("/products/all")
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/products/all" className="flex gap-3 items-center">
            <MdProductionQuantityLimits />
            <span>Products</span>
          </Link>
        </li>
        <li
          className={`${
            pathname.includes("/customers/all")
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/customers/all" className="flex gap-3 items-center">
            <FaUserTie />
            <span>Customers</span>
          </Link>
        </li>

        <li
          className={`${
            pathname.includes("/check")
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/check" className="flex gap-3 items-center">
            <BiCheckSquare />
            <span>Check</span>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/profile"
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/profile" className="flex gap-3 items-center">
            <ImProfile />
            <span>Profile</span>
          </Link>
        </li>
        <li
          className={`${
            pathname === "/moderators"
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <Link href="/moderators" className="flex gap-3 items-center">
            <MdAdminPanelSettings />
            <span>Moderators</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
