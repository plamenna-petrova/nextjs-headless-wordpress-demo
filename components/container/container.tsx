import { mergeClassNames } from "@/lib/utils";

type ContainerProps = {
    id?: string;
    className?: string;
    children: React.ReactNode;
};

const Container = ({ id, className, children }: ContainerProps) => {
    return (
        <div id={id} className={mergeClassNames("mx-auto max-w-5xl", "p-6 sm:p-8", className)}>
            {children}
        </div>
    );
};

export default Container;