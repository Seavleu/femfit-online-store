import { TButtonProps } from "@/types";
import { ArrowUpRight } from "lucide-react";
import LinkHover from "@/animation/LinkHover";

export default function Button({ href, title }: TButtonProps) {
	return (
		<div className="flex flex-col pb-[10px] w-fit">
			<div className="flex items-center gap-[5px] group">
				<div className="rounded-lg border border-[#21212199] group-hover:bg-secondry py-[3px] px-[12px] cursor-pointer">
					<LinkHover
						href={href}
						title={title}
						className="small-text font-NeueMontreal text-secondry uppercase group-hover:text-background transition-all duration-300 ease-in-out"
					/>
				</div>
				<div className="w-[33px] flex items-center justify-center h-[33px] border border-[#21212199] rounded-lg group-hover:bg-secondry transition-all duration-200 ease-in-out cursor-pointer scale-0 group-hover:scale-100 sm:hidden xm:hidden">
					<p className="small-text font-normal text-secondry group-hover:text-background">
						<ArrowUpRight
							strokeWidth={1.25}
							size={24}
						/>
					</p>
				</div>
			</div>
		</div>
	);
}
