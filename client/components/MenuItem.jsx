import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MenuItem({ children, title, icon, active }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border-none ">
        <AccordionTrigger
          className={`${
            active
              ? "bg-[#18181b] hover:bg-[#18181b] text-white"
              : "hover:bg-[#f4f4f5]"
          } py-2 px-2 rounded-md hover:no-underline   `}
        >
          <span className="flex gap-3 items-center">
            {icon}
            {title}
          </span>
        </AccordionTrigger>
        <AccordionContent className=" hover:bg-white bg-white py-1 pb-3">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
