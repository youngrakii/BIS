import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SimulatorPage from "./pages/SimulatorPage/SimulatorPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import RouteDetailsPage from "./pages/RouteDetailsPage/RouteDetailsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/route-details" element={<RouteDetailsPage />} />
                <Route path="/simulator" element={<SimulatorPage />} />
            </Routes>
        </Router>
    );
}

export default App;
