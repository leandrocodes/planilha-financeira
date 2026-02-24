import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export interface TransactionData {
	id?: string;
	title: string;
	amount: number | string;
	date: string;
	type: "income" | "expense";
	status?: "paga" | "pendente" | "atrasada";
	expenseType?: "fixa" | "variavel";
}

interface ManageTransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (transaction: TransactionData) => void;
	onDelete?: (id: string) => void;
	initialData?: TransactionData | null;
}

export const ManageTransactionModal = ({
	isOpen,
	onClose,
	onSave,
	onDelete,
	initialData,
}: ManageTransactionModalProps) => {
	const [type, setType] = useState<"income" | "expense">("expense");
	const [formData, setFormData] = useState({
		title: "",
		amount: "",
		date: "",
		status: "pendente" as "paga" | "pendente" | "atrasada",
		expenseType: "fixa" as "fixa" | "variavel",
	});

	useEffect(() => {
		if (initialData) {
			setType(initialData.type);
			setFormData({
				title: initialData.title,
				amount: String(initialData.amount),
				date: initialData.date.split("T")[0], // formats ISO to YYYY-MM-DD
				status: initialData.status || "pendente",
				expenseType: initialData.expenseType || "fixa",
			});
		} else {
			setType("expense");
			setFormData({
				title: "",
				amount: "",
				date: new Date().toISOString().split("T")[0],
				status: "pendente",
				expenseType: "fixa",
			});
		}
	}, [initialData]);

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-background/80 backdrop-blur-md"
					/>

					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="glass w-full max-w-lg rounded-3xl p-8 md:p-10 shadow-2xl shadow-primary/10 relative border-primary/30 z-10 overflow-hidden"
					>
						<div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

						<button
							type="button"
							onClick={onClose}
							className="absolute top-4 right-4 md:top-6 md:right-6 text-text-muted hover:text-accent transition-colors p-3 rounded-full hover:bg-surface"
						>
							<X className="w-6 h-6" />
						</button>

						<h2 className="text-3xl font-display font-bold mb-8 text-accent tracking-tight">
							{initialData ? "Editar Reg" : "Novo Reg"}
						</h2>

						<div className="flex gap-4 mb-6 bg-surface p-1.5 rounded-2xl border border-primary/20">
							<button
								type="button"
								onClick={() => setType("expense")}
								className={`flex-1 py-3 rounded-xl transition-all font-bold tracking-widest text-sm uppercase relative ${
									type === "expense"
										? "text-background"
										: "text-text-muted hover:text-accent"
								}`}
							>
								{type === "expense" && (
									<motion.div
										layoutId="type-selector"
										className="absolute inset-0 bg-danger rounded-xl -z-10 shadow-[0_0_15px_rgba(193,18,31,0.5)]"
									/>
								)}
								<span className="relative z-10">Saída</span>
							</button>
							<button
								type="button"
								onClick={() => setType("income")}
								className={`flex-1 py-3 rounded-xl transition-all font-bold tracking-widest text-sm uppercase relative ${
									type === "income"
										? "text-background"
										: "text-text-muted hover:text-accent"
								}`}
							>
								{type === "income" && (
									<motion.div
										layoutId="type-selector"
										className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-[0_0_15px_rgba(102,155,188,0.5)]"
									/>
								)}
								<span className="relative z-10">Entrada</span>
							</button>
						</div>

						<form
							className="flex flex-col gap-6"
							onSubmit={(e) => {
								e.preventDefault();
								onSave({ id: initialData?.id, ...formData, type });
							}}
						>
							<label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-primary">
								Descrição
								<input
									required
									type="text"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									className="bg-background/50 border border-primary/20 rounded-xl px-5 py-4 text-accent text-lg outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-inner font-sans tracking-wide placeholder:text-text-muted/30"
									placeholder="Ex: Assinatura"
								/>
							</label>

							<div className="grid grid-cols-2 gap-6">
								<label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-primary">
									Valor
									<div className="relative">
										<span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted font-mono">
											R$
										</span>
										<input
											required
											type="number"
											step="0.01"
											inputMode="decimal"
											value={formData.amount}
											onChange={(e) =>
												setFormData({ ...formData, amount: e.target.value })
											}
											className="w-full bg-background/50 border border-primary/20 rounded-xl pl-12 pr-5 py-4 text-accent text-lg font-mono outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-inner placeholder:text-text-muted/30"
											placeholder="0.00"
										/>
									</div>
								</label>

								<label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-primary">
									Data
									<input
										required
										type="date"
										value={formData.date}
										onChange={(e) =>
											setFormData({ ...formData, date: e.target.value })
										}
										className="w-full bg-background/50 border border-primary/20 rounded-xl px-5 py-4 text-accent text-lg font-mono outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-inner [color-scheme:dark]"
									/>
								</label>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-primary">
									Status
									<select
										value={formData.status}
										onChange={(e) =>
											setFormData({
												...formData,
												status: e.target.value as
													| "paga"
													| "pendente"
													| "atrasada",
											})
										}
										className="bg-background/50 border border-primary/20 rounded-xl px-5 py-4 text-accent text-sm outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-inner"
									>
										<option value="paga">Pago / Recebido</option>
										<option value="pendente">Pendente</option>
										<option value="atrasada">Atrasado</option>
									</select>
								</label>

								{type === "expense" && (
									<label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-primary">
										Tipo de Despesa
										<select
											value={formData.expenseType}
											onChange={(e) =>
												setFormData({
													...formData,
													expenseType: e.target.value as "fixa" | "variavel",
												})
											}
											className="bg-background/50 border border-primary/20 rounded-xl px-5 py-4 text-accent text-sm outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-inner"
										>
											<option value="fixa">Fixa</option>
											<option value="variavel">Variável</option>
										</select>
									</label>
								)}
							</div>

							<div className="flex gap-4 mt-2">
								{initialData && onDelete && initialData.id && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="button"
										onClick={() => onDelete(initialData.id as string)}
										className="p-4 bg-danger/10 text-danger rounded-xl border border-danger/20 transition-all shadow-inner hover:bg-danger hover:text-white"
									>
										<Trash2 className="w-6 h-6" />
									</motion.button>
								)}
								<motion.button
									whileHover={{
										scale: 1.02,
										boxShadow: "0 0 20px rgba(253,240,213,0.3)",
									}}
									whileTap={{ scale: 0.98 }}
									type="submit"
									className="flex-1 py-4 bg-accent text-background rounded-xl shadow-[0_0_15px_rgba(253,240,213,0.2)] transition-all font-bold uppercase tracking-widest text-sm"
								>
									Confirmar
								</motion.button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
