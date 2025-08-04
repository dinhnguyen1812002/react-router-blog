import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton() {
    return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
    </div>
    );
}