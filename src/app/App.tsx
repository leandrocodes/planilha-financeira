import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { MonthlyView } from "../pages/MonthlyView/MonthlyView";
import { BottomNav } from "../widgets/BottomNav/BottomNav";
import { Sidebar } from "../widgets/Sidebar/Sidebar";

export const App = () => {
	return (
		<BrowserRouter>
			<div className="flex h-screen overflow-hidden">
				<div className="hidden md:block h-full">
					<Sidebar />
				</div>
				<main className="flex-1 h-full relative overflow-hidden">
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/months" element={<MonthlyView />} />
						<Route
							path="*"
							element={<div className="p-8">Página não encontrada</div>}
						/>
					</Routes>
					<BottomNav />
				</main>
			</div>
		</BrowserRouter>
	);
};
