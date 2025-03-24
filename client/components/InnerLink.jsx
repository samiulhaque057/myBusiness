import Link from "next/link";
import { BiRectangle } from "react-icons/bi";

export default function InnerLink({ href, label, pathname }) {
  return (
    <li>
      <Link
        href={href}
        className={`
            ${
              pathname === href ? "bg-black/5" : ""
            } py-2 flex  items-center gap-2   rounded-md hover:bg-black/5 px-2 w-full cursor-pointer text-black/20`}
      >
        <BiRectangle className="text-[10px]" />
        <span className="text-black">{label}</span>
      </Link>
    </li>
  );
}
