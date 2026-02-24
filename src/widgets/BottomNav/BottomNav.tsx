import clsx from "clsx";
import { motion } from "framer-motion";
import { CalendarDays, Home, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export const BottomNav = () => {
	const navItems = [
		{ to: "/", label: "Início", icon: Home },
		{ to: "/months", label: "Mensal", icon: CalendarDays },
		{ to: "/settings", label: "Ajustes", icon: Settings },
	];

	return (
		<div className="fixed bottom-0 left-0 right-0 h-20 pt-2 pb-[env(safe-area-inset-bottom)] glass border-t border-primary/20 z-50 flex items-center justify-around px-2 bg-background/90 md:hidden">
			{navItems.map((item) => (
				<NavLink
					key={item.to}
					to={item.to}
					className={({ isActive }) =>
						clsx(
							"flex flex-col items-center justify-center w-full h-full relative transition-colors duration-300",
							isActive ? "text-primary" : "text-text-muted hover:text-accent",
						)
					}
				>
					{({ isActive }) => (
						<>
							{isActive && (
								<motion.div
									layoutId="active-bottom-nav"
									className="absolute -top-[1px] w-12 h-1 bg-primary rounded-b-full shadow-[0_0_10px_theme(colors.primary.DEFAULT)]"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}
							<div
								className={clsx(
									"p-2 rounded-full transition-all duration-300",
									isActive && "bg-primary/10 mb-1",
								)}
							>
								<item.icon
									className={clsx(
										"w-6 h-6",
										isActive && "drop-shadow-[0_0_8px_currentColor]",
									)}
									strokeWidth={isActive ? 2.5 : 2}
								/>
							</div>
							<span
								className={clsx(
									"text-[10px] font-medium tracking-widest uppercase transition-all duration-300",
									isActive ? "opacity-100" : "opacity-0 h-0",
								)}
							>
								{item.label}
							</span>
						</>
					)}
				</NavLink>
			))}
		</div>
	);
};
