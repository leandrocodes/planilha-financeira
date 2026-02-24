export type TransactionType = "income" | "expense";
export type TransactionStatus = "paga" | "pendente" | "atrasada";
export type ExpenseType = "fixa" | "variavel";

export interface Transaction {
	id: string;
	title: string;
	amount: number;
	type: TransactionType;
	category: string;
	status?: TransactionStatus;
	expenseType?: ExpenseType;
	date: string; // ISO format or timestamp
	month: number; // 1-12
	year: number;
}
