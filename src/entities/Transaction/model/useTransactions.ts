import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../shared/api/firebase";
import type { Transaction } from "./types";

export const useTransactions = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const q = query(collection(db, "transactions"), orderBy("date", "desc"));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const data: Transaction[] = [];
				snapshot.forEach((doc) => {
					data.push({ id: doc.id, ...doc.data() } as Transaction);
				});
				setTransactions(data);
				setLoading(false);
			},
			(err) => {
				console.error(err);
				setError(err);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, []);

	const addTransaction = async (transaction: Omit<Transaction, "id">) => {
		try {
			await addDoc(collection(db, "transactions"), transaction);
		} catch (err: unknown) {
			console.error("Error adding transaction: ", err);
			throw err;
		}
	};

	const updateTransaction = async (
		id: string,
		data: Partial<Omit<Transaction, "id">>,
	) => {
		try {
			const docRef = doc(db, "transactions", id);
			await updateDoc(docRef, data);
		} catch (err: unknown) {
			console.error("Error updating transaction: ", err);
			throw err;
		}
	};

	const deleteTransactionItem = async (id: string) => {
		try {
			await deleteDoc(doc(db, "transactions", id));
		} catch (err: unknown) {
			console.error("Error deleting transaction: ", err);
			throw err;
		}
	};

	return {
		transactions,
		loading,
		error,
		addTransaction,
		updateTransaction,
		deleteTransactionItem,
	};
};
