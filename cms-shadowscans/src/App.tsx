import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddSeriesPage from "./pages/AddSeriesPage";
import HomePage from "./pages/HomePage";
import ManageSeries from "./pages/ManageSeries";

function App() {
    return (
        <div className="max-w-7xl mx-auto min-h-screen flex">
            <div className="fixed h-full border-r border-[#dadada38]">
                <Sidebar />
            </div>
            <div className="w-full h-full pl-44 py-6">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add_series" element={<AddSeriesPage />} />
                    <Route path="/manage_series" element={<ManageSeries />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
