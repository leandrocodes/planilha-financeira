import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTransactions } from "../../entities/Transaction/model/useTransactions";
import {
	ManageTransactionModal,
	type TransactionData,
} from "../../features/ManageTransaction/ManageTransactionModal";

export const MonthlyView = () => {
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
	const [modalData, setModalData] = useState<TransactionData | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {
		transactions,
		loading,
		addTransaction,
		updateTransaction,
		deleteTransactionItem,
	} = useTransactions();

	const months = [
		"Jan",
		"Fev",
		"Mar",
		"Abr",
		"Mai",
		"Jun",
		"Jul",
		"Ago",
		"Set",
		"Out",
		"Nov",
		"Dez",
	];
	const currentYear = new Date().getFullYear();

	const monthTransactions = useMemo(() => {
		return transactions.filter(
			(t) => t.month === selectedMonth && t.year === currentYear,
		);
	}, [transactions, selectedMonth, currentYear]);

	const { incomes, fixedExpenses, variableExpenses, totals } = useMemo(() => {
		const inc: typeof transactions = [];
		const fixExp: typeof transactions = [];
		const varExp: typeof transactions = [];

		let totalIncProj = 0;
		let totalExpProj = 0;
		let totalIncPaid = 0;
		let totalExpPaid = 0;

		for (const t of monthTransactions) {
			if (t.type === "income") {
				inc.push(t);
				totalIncProj += t.amount;
				if (t.status === "paga") totalIncPaid += t.amount;
			} else {
				if (t.expenseType === "variavel") varExp.push(t);
				else fixExp.push(t);

				totalExpProj += t.amount;
				if (t.status === "paga") totalExpPaid += t.amount;
			}
		}

		return {
			incomes: inc.sort((a, b) => b.amount - a.amount),
			fixedExpenses: fixExp.sort((a, b) => b.amount - a.amount),
			variableExpenses: varExp.sort((a, b) => b.amount - a.amount),
			totals: {
				projectedIncome: totalIncProj,
				projectedExpense: totalExpProj,
				projectedBalance: totalIncProj - totalExpProj,
				paidIncome: totalIncPaid,
				paidExpense: totalExpPaid,
				paidBalance: totalIncPaid - totalExpPaid,
			},
		};
	}, [monthTransactions]);

	const handleSave = async (data: TransactionData) => {
		try {
			const dateObj = new Date(data.date);
			const payload = {
				title: data.title,
				amount: Number(data.amount),
				type: data.type,
				date: data.date,
				month: dateObj.getMonth() + 1,
				year: dateObj.getFullYear(),
				category: "Geral",
				status: data.status,
				expenseType: data.expenseType,
			};

			if (data.id) {
				await updateTransaction(data.id, payload);
			} else {
				await addTransaction(payload);
			}
			setIsModalOpen(false);
		} catch (_err) {
			alert("Erro ao salvar transação");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			if (confirm("Tem certeza que deseja excluir?")) {
				await deleteTransactionItem(id);
				setIsModalOpen(false);
			}
		} catch (_err) {
			alert("Erro ao excluir transação");
		}
	};

	const openNewModal = () => {
		setModalData(null);
		setIsModalOpen(true);
	};

	const openEditModal = (t: (typeof transactions)[0]) => {
		setModalData({
			id: t.id,
			title: t.title,
			amount: t.amount,
			type: t.type,
			date: t.date,
			status: t.status,
			expenseType: t.expenseType,
		});
		setIsModalOpen(true);
	};

	const formatCurrency = (val: number) =>
		new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(val);

	const StatusIndicator = ({ status }: { status?: string }) => {
		if (status === "paga")
			return (
				<span
					className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_theme(colors.green.500)]"
					title="Pago/Recebido"
				></span>
			);
		if (status === "atrasada")
			return (
				<span
					className="w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_theme(colors.danger)]"
					title="Atrasada"
				></span>
			);
		return (
			<span
				className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_theme(colors.yellow.500)]"
				title="Pendente"
			></span>
		);
	};

	return (
		<div className="p-8 md:p-12 h-full flex flex-col w-full overflow-hidden relative z-10">
			<header className="mb-8 flex justify-between items-center flex-wrap gap-6 shrink-0">
				<div>
					<motion.h1
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-4xl md:text-5xl font-extrabold text-accent mb-3 tracking-tight"
					>
						Consolidação
					</motion.h1>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="text-text-muted text-lg tracking-wide"
					>
						Detalhamento mensal estruturado.
					</motion.p>
				</div>
				<motion.button
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.3 }}
					whileHover={{
						scale: 1.05,
						boxShadow: "0 0 20px rgba(102,155,188,0.5)",
					}}
					whileTap={{ scale: 0.95 }}
					type="button"
					onClick={openNewModal}
					className="px-8 py-3 bg-primary text-background rounded-full shadow-[0_0_15px_rgba(102,155,188,0.3)] transition-colors font-bold tracking-widest uppercase text-sm border border-primary/50"
				>
					Novo Registro
				</motion.button>
			</header>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide shrink-0"
			>
				{months.map((month, index) => {
					const monthNum = index + 1;
					const isActive = selectedMonth === monthNum;
					return (
						<button
							key={month}
							type="button"
							onClick={() => setSelectedMonth(monthNum)}
							className={`relative px-8 py-3 rounded-full whitespace-nowrap transition-all font-mono uppercase text-sm tracking-widest overflow-hidden group ${
								isActive
									? "text-background shadow-[0_0_15px_rgba(253,240,213,0.3)] cursor-default"
									: "bg-surface text-text-muted border border-primary/20 hover:text-accent"
							}`}
						>
							{isActive && (
								<motion.div
									layoutId="active-month"
									className="absolute inset-0 bg-accent rounded-full -z-10"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}
							<span className="relative z-10">{month}</span>
						</button>
					);
				})}
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5 }}
				className="flex-1 flex flex-col xl:flex-row gap-8 relative overflow-hidden min-h-0"
			>
				{loading ? (
					<div className="w-full flex items-center justify-center text-primary font-mono animate-pulse tracking-widest">
						Sincronizando...
					</div>
				) : (
					<>
						<div className="flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-hide pr-2">
							{/* Income Section */}
							<div className="glass rounded-3xl border border-primary/20 p-6 xl:p-8 flex flex-col shrink-0">
								<div className="flex justify-between items-end border-b border-primary/20 pb-4 mb-4 mt-2">
									<h2 className="flex items-center gap-3 text-xl font-bold uppercase tracking-widest text-primary">
										Entradas
									</h2>
									<span className="text-xl font-mono text-primary drop-shadow-[0_0_10px_currentColor]">
										+{formatCurrency(totals.projectedIncome)}
									</span>
								</div>

								<div className="flex flex-col gap-2">
									<AnimatePresence>
										{incomes.map((t, idx) => (
											<motion.div
												layout
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												transition={{ delay: idx * 0.05 }}
												key={t.id}
												onClick={() => openEditModal(t)}
												className="flex justify-between items-center p-4 bg-surface/50 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
											>
												<div className="flex items-center gap-4">
													<StatusIndicator status={t.status} />
													<span className="text-accent text-sm md:text-base">
														{t.title}
													</span>
												</div>
												<span className="font-mono text-text-muted text-sm md:text-base">
													{formatCurrency(t.amount)}
												</span>
											</motion.div>
										))}
										{incomes.length === 0 && (
											<p className="text-text-muted/50 font-mono tracking-widest uppercase text-xs text-center py-4">
												Vazio
											</p>
										)}
									</AnimatePresence>
								</div>
							</div>

							{/* Fixed Expenses Section */}
							<div className="glass rounded-3xl border border-danger/20 p-6 xl:p-8 flex flex-col shrink-0">
								<div className="flex justify-between items-end border-b border-danger/20 pb-4 mb-4 mt-2">
									<h2 className="flex items-center gap-3 text-xl font-bold uppercase tracking-widest text-danger">
										Despesas Fixas
									</h2>
								</div>

								<div className="flex flex-col gap-2">
									<AnimatePresence>
										{fixedExpenses.map((t, idx) => (
											<motion.div
												layout
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												transition={{ delay: idx * 0.05 }}
												key={t.id}
												onClick={() => openEditModal(t)}
												className="flex justify-between items-center p-4 bg-surface/50 rounded-xl hover:bg-danger/10 transition-colors cursor-pointer border border-transparent hover:border-danger/20"
											>
												<div className="flex items-center gap-4">
													<StatusIndicator status={t.status} />
													<span className="text-accent text-sm md:text-base">
														{t.title}
													</span>
												</div>
												<span className="font-mono text-text-muted text-sm md:text-base">
													{formatCurrency(t.amount)}
												</span>
											</motion.div>
										))}
										{fixedExpenses.length === 0 && (
											<p className="text-text-muted/50 font-mono tracking-widest uppercase text-xs text-center py-4">
												Vazio
											</p>
										)}
									</AnimatePresence>
								</div>
							</div>

							{/* Variable Expenses Section */}
							<div className="glass rounded-3xl border border-danger/20 p-6 xl:p-8 flex flex-col shrink-0 mb-8">
								<div className="flex justify-between items-end border-b border-danger/20 pb-4 mb-4 mt-2">
									<h2 className="flex items-center gap-3 text-xl font-bold uppercase tracking-widest text-danger">
										Despesas Variáveis
									</h2>
								</div>

								<div className="flex flex-col gap-2">
									<AnimatePresence>
										{variableExpenses.map((t, idx) => (
											<motion.div
												layout
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												transition={{ delay: idx * 0.05 }}
												key={t.id}
												onClick={() => openEditModal(t)}
												className="flex justify-between items-center p-4 bg-surface/50 rounded-xl hover:bg-danger/10 transition-colors cursor-pointer border border-transparent hover:border-danger/20"
											>
												<div className="flex items-center gap-4">
													<StatusIndicator status={t.status} />
													<span className="text-accent text-sm md:text-base">
														{t.title}
													</span>
												</div>
												<span className="font-mono text-text-muted text-sm md:text-base">
													{formatCurrency(t.amount)}
												</span>
											</motion.div>
										))}
										{variableExpenses.length === 0 && (
											<p className="text-text-muted/50 font-mono tracking-widest uppercase text-xs text-center py-4">
												Vazio
											</p>
										)}
									</AnimatePresence>
								</div>
							</div>
						</div>

						{/* Summary Tabs/Card */}
						<div className="w-full xl:w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto pb-8 scrollbar-hide">
							<div className="glass rounded-3xl border border-accent/20 p-6 md:p-8 flex flex-col">
								<h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-6 opacity-80">
									Saldo Consolidado (Pago)
								</h2>

								<div className="flex justify-between items-center mb-3 text-sm font-mono text-text-muted">
									<span>Receitas</span>
									<span className="text-primary">
										{formatCurrency(totals.paidIncome)}
									</span>
								</div>
								<div className="flex justify-between items-center mb-6 text-sm font-mono text-text-muted">
									<span>Despesas</span>
									<span className="text-danger">
										-{formatCurrency(totals.paidExpense)}
									</span>
								</div>

								<div className="pt-4 border-t border-accent/20">
									<span className="block text-xs uppercase tracking-widest text-text-muted mb-2">
										Balanço Atual
									</span>
									<span
										className={`text-4xl font-mono font-bold drop-shadow-[0_0_15px_currentColor] ${totals.paidBalance >= 0 ? "text-accent" : "text-danger"}`}
									>
										{formatCurrency(totals.paidBalance)}
									</span>
								</div>
							</div>

							<div className="glass rounded-3xl border border-primary/10 p-6 md:p-8 flex flex-col relative overflow-hidden">
								<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
								<h2 className="text-xs font-bold uppercase tracking-widest text-text-muted/60 mb-6 font-mono">
									Projeção Mensal
								</h2>

								<div className="flex justify-between items-center mb-3 text-sm font-mono text-text-muted/70">
									<span>Previsto Receitas</span>
									<span>{formatCurrency(totals.projectedIncome)}</span>
								</div>
								<div className="flex justify-between items-center mb-6 text-sm font-mono text-text-muted/70">
									<span>Previsto Despesas</span>
									<span>-{formatCurrency(totals.projectedExpense)}</span>
								</div>

								<div className="pt-4 border-t border-primary/10">
									<span className="block text-[10px] uppercase tracking-widest text-text-muted/50 mb-1">
										Balanço Projetado
									</span>
									<span
										className={`text-xl font-mono ${totals.projectedBalance >= 0 ? "text-primary/80" : "text-danger/80"}`}
									>
										{formatCurrency(totals.projectedBalance)}
									</span>
								</div>
							</div>

							<div className="mt-auto pt-4 flex gap-4 p-4 items-center justify-center text-xs font-mono text-text-muted/50">
								<div className="flex items-center gap-2">
									<StatusIndicator status="paga" /> Pago
								</div>
								<div className="flex items-center gap-2">
									<StatusIndicator status="pendente" /> Pendente
								</div>
								<div className="flex items-center gap-2">
									<StatusIndicator status="atrasada" /> Atraso
								</div>
							</div>
						</div>
					</>
				)}
			</motion.div>

			<ManageTransactionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSave}
				onDelete={handleDelete}
				initialData={modalData}
			/>
		</div>
	);
};
