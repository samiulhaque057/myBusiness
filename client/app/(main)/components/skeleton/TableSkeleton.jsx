import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="flex flex-col space-y-3 pt-6 ">
      <div className="flex justify-center flex-wrap  gap-1">
        <div className="w-full">
          <Skeleton className="h-[56px] w-full rounded-xl" />
        </div>
        {Array(30)
          .fill(null)
          .map((_, index) => (
            <div className="w-[calc(20%-3.5px)]" key={index}>
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}
      </div>
    </div>
  );
}
