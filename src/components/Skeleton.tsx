import { clsx } from "clsx";

interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div
            className={clsx(
                "animate-pulse bg-concrete/20 rounded-md",
                className
            )}
        />
    );
};

export default Skeleton;
