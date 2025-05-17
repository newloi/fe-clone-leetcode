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
import LayoutWorkSpace from "./pages/LayoutWorkSpace/LayoutWorkSpace";
import AdminProblems from "./components/AdminProblems/AdminProblems";
import AddNewProblem from "./components/AddNewProblem/AddNewProblem";

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
                <Route element={<LayoutWorkSpace />}>
                    <Route
                        path="/problem/:problemId/:problemIndex"
                        element={<WorkSpaceWrapper />}
                    />
                </Route>
                <Route
                    path="/post-solution/:resultId"
                    element={<PostSolution />}
                />
                <Route path="*" element={<NotFound />} />
                <Route element={<Admin />}>
                    <Route path="admin/problems" element={<AdminProblems />} />
                    <Route
                        path="admin/add-new-problem"
                        element={<AddNewProblem />}
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
