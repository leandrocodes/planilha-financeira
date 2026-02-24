import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { MonthlyView } from "../pages/MonthlyView/MonthlyView";
import { Sidebar } from "../widgets/Sidebar/Sidebar";

export const App = () => {
	return (
		<BrowserRouter>
			<div className="flex h-screen overflow-hidden">
				<Sidebar />
				<main className="flex-1 h-full">
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/months" element={<MonthlyView />} />
						<Route
							path="*"
							element={<div className="p-8">Página não encontrada</div>}
						/>
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
};
