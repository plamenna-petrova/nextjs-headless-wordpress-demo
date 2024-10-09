import { mergeClassNames } from "@/lib/utils";

type SectionProps = {
    id?: string;
    className?: string;
    children: React.ReactNode;
};

const Section = ({ id, className, children }: SectionProps) => {
    return (
        <section id={id} className={mergeClassNames("py-8 md:py-12 fade-in", className)}>
            {children}
        </section>
    );
};

export default Section;