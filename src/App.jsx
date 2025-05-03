import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { SignUp, VerifyEmail } from "./pages/SignUp";
import { SignIn, ResetPassword, ChangePassword } from "./pages/SignIn";
import WorkSpace from "./pages/WorkSpace/WorkSpace";
import Home from "./pages/Home/Home";
import "./App.css";
import PostSolution from "./pages/PostSolution/PostSolution";

function App() {
    return (
        <Router>
            <ToastContainer />
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
                <Route path="/" element={<Home />} />
                <Route
                    path="/problem/:problemId/:problemIndex"
                    element={<WorkSpace />}
                />
                <Route
                    path="/post-solution/:resultId"
                    element={<PostSolution />}
                />
            </Routes>
        </Router>
    );
}

export default App;
