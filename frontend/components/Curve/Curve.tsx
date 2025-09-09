"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { text, curve, translate } from "@/motion";
import { TCurveProps } from "@/types";

const routes: Record<string, string> = {
	"/": "FEMFIT",
	"/shop": "Shop",
	"/products": "Products",
	"/about": "About Us",
	"/contact": "Contact Us",
	"/cart": "Shopping Cart",
	"/checkout": "Checkout",
	// "/curated/dry-season": "Dry Season",
	// "/curated/wet-season": "Wet Season",
	// "/shop/women/bags": "Women's Bags",
	// "/shop/women/boots": "Women's Boots",
	// "/shop/women/shoes": "Women's Shoes",
	// "/shop/women/loafers": "Women's Loafers",
	// "/shop/women/new": "New Products",
};

const anim = (variants: any) => {
	return {
		variants,
		initial: "initial",
		animate: "enter",
		exit: "exit",
	};
};

export default function Curve({ children, backgroundColor = "#f1f1f1" }: TCurveProps) {
	const pathname = usePathname();
	const [dimensions, setDimensions] = useState<{
		width: number | null;
		height: number | null;
	}>({
		width: null,
		height: null,
	});

	useEffect(() => {
		function resize() {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}
		resize();
		window.addEventListener("resize", resize);
		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);

	return (
		<div style={{ backgroundColor }}>
			<div
				style={{ opacity: dimensions.width == null ? 1 : 0 }}
				className="fixed h-full w-full pointer-events-none left-0 top-0 z-50 bg-black"
			/>
			<motion.p
				className="absolute left-1/2 top-[40%] text-white text-[50px] z-[60] -translate-x-1/2 text-center font-light"
				{...anim(text)}>
				{routes[pathname] || "FEMFIT"}
			</motion.p>
			{dimensions.width != null && <SVG {...dimensions} />}
			{children}
		</div>
	);
}

const SVG = ({ height, width }: { height: number; width: number }) => {
	const initialPath = `
        M0 300 
        Q${width / 2} 0 ${width} 300
        L${width} ${height + 300}
        Q${width / 2} ${height + 600} 0 ${height + 300}
        L0 0
    `;

	const targetPath = `
        M0 300
        Q${width / 2} 0 ${width} 300
        L${width} ${height}
        Q${width / 2} ${height} 0 ${height}
        L0 0
    `;

	return (
		<motion.svg
			className="fixed h-full w-full pointer-events-none left-0 top-0 z-50"
			{...anim(translate)}>
			<motion.path 
				fill="black"
				{...anim(curve(initialPath, targetPath))} 
			/>
		</motion.svg>
	);
};
