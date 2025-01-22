import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import { ToastContainer } from "react-toastify";

const App = () => (
    <Router>
        <ToastContainer />
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
        </Routes>
    </Router>
);

export default App;
