export default function ProductInformation({ name, id, status }) {
  return (
    <div className="pt-6">
      <h2 className=" pb-4 text-[22px] sm:text-2xl  md:text-3xl font-bold tracking-tight text-center ">
        {name}
      </h2>
      <div className="flex gap-6 items-center justify-center">
        <p className="flex gap-3 items-center">
          <span className="font-semibold">Id:</span>
          <span>{id}</span>
        </p>
        <p className="flex gap-3 items-center">
          <span className="font-semibold">Status:</span>
          <span>{status}</span>
        </p>
      </div>
    </div>
  );
}
