import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { SignUp, VerifyEmail } from "./pages/SignUp";
import { SignIn, ResetPassword, ChangePassword } from "./pages/SignIn";
import WorkSpaceWrapper from "./pages/WorkSpace/WorkSpace";
import Home from "./pages/Home/Home";
import "./App.css";
import PostSolution from "./pages/PostSolution/PostSolution";
import NotFound from "./pages/NotFound/NotFound";
import Admin from "./pages/Admin/Admin";

const App = () => {
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
                />{" "}
                // ? Security
                <Route path="/" element={<Home />} />
                <Route
                    path="/problem/:problemId/:problemIndex"
                    element={<WorkSpaceWrapper />}
                />
                <Route
                    path="/post-solution/:resultId"
                    element={<PostSolution />}
                />
                <Route path="*" element={<NotFound />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Router>
    );
};

export default App;
