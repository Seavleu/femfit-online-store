import Rounded from "./SquareButton";
import LinkHover from "@/animation/LinkHover";

interface RatingButtonProps {
  href: string;
  title: string;
  className?: string;
}

export default function RatingButton({ href, title, className = "" }: RatingButtonProps) {
  return (
    <div className={`absolute left-[25px] bottom-[35px] w-fit rounded-[50px] border border-white cursor-pointer ${className}`}>
      <Rounded backgroundColor="#fff" className="">
        <LinkHover
          href={href}
          title={title}
          className="z-10 px-[12px] py-[8px] hover:text-black xl:text-[18px] xl:leading-[18px] text-[14px] leading-[14px] font-NeueMontreal text-white uppercase tracking-wider"
        />
      </Rounded>
    </div>
  );
}
