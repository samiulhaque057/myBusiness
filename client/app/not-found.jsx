import Image from "next/image";

export default function NotFound() {
  return (
    <div className=" min-h-screen w-full  grid place-content-center">
      <Image
        src={"/not_found.gif"}
        alt="Not Found"
        width={400}
        height={400}
        className="px-10"
      />
      <p className="text-center md:text-3xl text-2xl font-medium text-red-500 py-2">
        Page Not Found!
      </p>
    </div>
  );
}
