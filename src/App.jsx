import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { SignUp, VerifyEmail } from "./components/SignUp";
import { SignIn, ResetPassword, ChangePassword } from "./components/SignIn";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route
                    path="/sign-up/verify-email/:emailAddress"
                    element={<VerifyEmail />}
                />
                <Route path="/forgot-password" element={<ResetPassword />} />
                <Route
                    path="/forgot-password/change-password/:emailAddress"
                    element={<ChangePassword />}
                />
            </Routes>
        </Router>
    );
}

export default App;
