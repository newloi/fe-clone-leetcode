import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { SignUp, VerifyEmail } from "./pages/SignUp";
import { SignIn, ResetPassword, ChangePassword } from "./pages/SignIn";
// import CodeEditor from "./components/CodeEditor/CodeEditor";
import WorkSpace from "./pages/WorkSpace/WorkSpace";
import Home from "./pages/Home/Home";
import "./App.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/sign-in" element={<SignIn />} />
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
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<WorkSpace />} />
            </Routes>
        </Router>
    );
}

export default App;
