import { type HTMLMotionProps, motion } from "framer-motion";
import type React from "react";

interface CardProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}

export const Card = ({
	children,
	className = "",
	delay = 0,
	...props
}: CardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className={`glass p-6 rounded-2xl ${className}`}
			{...props}
		>
			{children}
		</motion.div>
	);
};
