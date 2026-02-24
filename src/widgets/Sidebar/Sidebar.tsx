import clsx from "clsx";
import { motion } from "framer-motion";
import { CalendarDays, Home, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
	const navItems = [
		{ to: "/", label: "Dashboard", icon: Home },
		{ to: "/months", label: "Mensal", icon: CalendarDays },
		{ to: "/settings", label: "Ajustes", icon: Settings },
	];

	return (
		<motion.aside
			initial={{ x: -50, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="w-20 md:w-64 h-full glass flex flex-col items-center py-8 border-r border-primary/20 bg-background/80 relative z-20"
		>
			<div className="mb-10 text-center w-full px-4 mt-2">
				{/* Brutalist Logo */}
				<svg
					width="48"
					height="48"
					viewBox="0 0 100 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="mx-auto mb-6 text-text-main drop-shadow-[4px_4px_0_theme(colors.primary)] hidden md:block"
					role="img"
					aria-label="FinSpace Logo"
				>
					<title>FinSpace Logo</title>
					<rect
						x="10"
						y="10"
						width="80"
						height="80"
						stroke="currentColor"
						strokeWidth="12"
						fill="transparent"
					/>
					<path
						d="M 50 10 L 50 90 M 10 50 L 90 50 M 15 15 L 85 85"
						stroke="currentColor"
						strokeWidth="12"
					/>
					<circle cx="50" cy="50" r="16" fill="theme(colors.danger)" />
				</svg>

				<h1 className="text-xl md:text-2xl font-display font-black tracking-tight text-text-main hidden md:block uppercase">
					FinSpace
				</h1>

				{/* Mobile Logo */}
				<div className="md:hidden w-12 h-12 flex items-center justify-center mx-auto relative group">
					<svg
						width="100%"
						height="100%"
						viewBox="0 0 100 100"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="text-text-main drop-shadow-[3px_3px_0_theme(colors.primary)]"
						role="img"
						aria-label="FinSpace Mobile Logo"
					>
						<title>FinSpace Logo</title>
						<rect
							x="10"
							y="10"
							width="80"
							height="80"
							stroke="currentColor"
							strokeWidth="12"
							fill="transparent"
						/>
						<path
							d="M 50 10 L 50 90 M 10 50 L 90 50 M 15 15 L 85 85"
							stroke="currentColor"
							strokeWidth="12"
						/>
						<circle cx="50" cy="50" r="16" fill="theme(colors.danger)" />
					</svg>
				</div>
			</div>

			<nav className="flex-1 w-full px-3 md:px-4 flex flex-col gap-3">
				{navItems.map((item, i) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							clsx(
								"group flex items-center justify-center md:justify-start gap-4 px-3 md:px-4 py-3 md:py-4 rounded-2xl transition-all duration-300 relative overflow-hidden",
								isActive
									? "text-background font-medium shadow-[0_0_15px_rgba(253,240,213,0.3)]"
									: "text-text-muted hover:text-accent",
							)
						}
					>
						{({ isActive }) => (
							<>
								{isActive && (
									<motion.div
										layoutId="active-nav"
										className="absolute inset-0 bg-accent rounded-2xl -z-10"
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
									/>
								)}
								<motion.div
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 * i + 0.3 }}
								>
									<item.icon
										className={clsx(
											"w-6 h-6 z-10",
											isActive && "text-background",
										)}
									/>
								</motion.div>
								<motion.span
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 * i + 0.4 }}
									className="hidden md:block z-10"
								>
									{item.label}
								</motion.span>
							</>
						)}
					</NavLink>
				))}
			</nav>
		</motion.aside>
	);
};
