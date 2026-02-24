import { motion } from "framer-motion";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useTransactions } from "../../entities/Transaction/model/useTransactions";
import { Card } from "../../shared/ui/Card";

export const Dashboard = () => {
	const { transactions, loading } = useTransactions();

	const currentYear = new Date().getFullYear();
	const yearTransactions = transactions.filter((t) => t.year === currentYear);

	const totalIncome = yearTransactions
		.filter((t) => t.type === "income")
		.reduce((acc, curr) => acc + curr.amount, 0);
	const totalExpense = yearTransactions
		.filter((t) => t.type === "expense")
		.reduce((acc, curr) => acc + curr.amount, 0);
	const balance = totalIncome - totalExpense;

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(val);

	return (
		<div className="p-4 md:p-12 pb-24 md:pb-12 h-full overflow-y-auto w-full relative z-10">
			<header className="mb-8 md:mb-12">
				<motion.h1
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-4xl md:text-5xl font-display font-bold text-accent mb-3 tracking-tight"
				>
					Visão Geral
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="text-text-muted text-lg tracking-wide"
				>
					Resumo financeiro de {currentYear}.
				</motion.p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<Card
					delay={0.1}
					className="flex flex-col gap-6 relative overflow-hidden group"
				>
					<div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
					<div className="flex items-center gap-3 text-primary uppercase text-sm font-bold tracking-widest z-10">
						<div className="p-2.5 bg-primary/10 rounded-xl border border-primary/30">
							<TrendingUp className="w-5 h-5" />
						</div>
						Receitas
					</div>
					<p className="text-4xl font-light font-mono text-accent z-10 drop-shadow-[0_0_10px_rgba(253,240,213,0.3)]">
						{formatCurrency(totalIncome)}
					</p>
				</Card>

				<Card
					delay={0.2}
					className="flex flex-col gap-6 relative overflow-hidden group"
				>
					<div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
					<div className="flex items-center gap-3 text-danger uppercase text-sm font-bold tracking-widest z-10">
						<div className="p-2.5 bg-danger-dark/30 rounded-xl border border-danger/30">
							<TrendingDown className="w-5 h-5" />
						</div>
						Despesas
					</div>
					<p className="text-4xl font-light font-mono text-danger z-10 drop-shadow-[0_0_10px_rgba(193,18,31,0.5)]">
						{formatCurrency(totalExpense)}
					</p>
				</Card>

				<Card
					delay={0.3}
					className="flex flex-col gap-6 relative overflow-hidden group border-primary/40 bg-primary/5"
				>
					<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0"></div>
					<div className="flex items-center gap-3 text-accent uppercase text-sm font-bold tracking-widest z-10">
						<div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent">
							<DollarSign className="w-5 h-5" />
						</div>
						Balanço
					</div>
					<p className="text-4xl font-bold font-mono text-accent z-10 drop-shadow-[0_0_15px_rgba(253,240,213,0.6)]">
						{formatCurrency(balance)}
					</p>
				</Card>
			</div>

			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
			>
				<h2 className="text-sm text-primary uppercase font-bold tracking-widest mb-6 px-2">
					Transações Recentes
				</h2>
				<div className="flex flex-col gap-4">
					{loading ? (
						<div className="p-8 text-center text-text-muted animate-pulse">
							Carregando dados...
						</div>
					) : transactions.length === 0 ? (
						<div className="p-8 text-center text-text-muted glass rounded-2xl">
							Nenhuma atividade detectada.
						</div>
					) : (
						transactions.slice(0, 5).map((t, i) => (
							<motion.div
								key={t.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 + i * 0.1 }}
								whileHover={{
									scale: 1.01,
									backgroundColor: "rgba(102, 155, 188, 0.15)",
								}}
								className="flex justify-between items-center p-5 lg:p-6 glass rounded-2xl border border-white/5 transition-all cursor-default"
							>
								<div className="flex items-center gap-4">
									<div
										className={`w-2 h-10 rounded-full ${t.type === "income" ? "bg-primary" : "bg-danger"}`}
									></div>
									<div>
										<p className="text-lg font-medium text-accent">{t.title}</p>
										<p className="text-sm text-text-muted/70 tracking-wide font-mono mt-1">
											{new Date(t.date).toLocaleDateString("pt-BR")}
										</p>
									</div>
								</div>
								<p
									className={`text-xl font-light font-mono ${t.type === "income" ? "text-primary" : "text-danger"}`}
								>
									{t.type === "income" ? "+" : "-"}
									{formatCurrency(t.amount)}
								</p>
							</motion.div>
						))
					)}
				</div>
			</motion.section>
		</div>
	);
};
