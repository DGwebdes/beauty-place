import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import ServiceDetails from "./pages/ServiceDetails";
import Footer from "./components/Footer";

function App() {
    return (
        <Router>
            <div
                style={{
                    backgroundColor: "#e5e5f7",
                    opacity: 0.9,
                    backgroundSize: 15,
                    backgroundImage:
                        "repeating-linear-gradient(to right, oklch(0.769 0.188 70.08), oklch(0.769 0.188 70.08) 1px, #e5e5f7 1px, #e5e5f7)",
                }}
            >
                <Navbar />
                <main className="md:px-15">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/services/:serviceId"
                            element={<ServiceDetails />}
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
