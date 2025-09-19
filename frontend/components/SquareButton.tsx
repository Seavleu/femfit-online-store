"use client";
import { TRoundedProps } from "@/types";

export default function Rounded({
	children,
	className,
	backgroundColor,
	...attributes
}: TRoundedProps) {
	return (
		<div
			className={`relative flex items-center justify-center overflow-hidden group ${className}`}
			{...attributes}
		>
			{children}
			<div
				style={{ backgroundColor }}
				className={`w-full h-full absolute rounded-[50%] top-full group-hover:top-0 transition-all duration-300 ease-out`}
			/>
		</div>
	);
}
