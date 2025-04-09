import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { SignUp, VerifyEmail } from "./pages/SignUp";
import { SignIn, ResetPassword, ChangePassword } from "./pages/SignIn";
// import CodeEditor from "./components/CodeEditor/CodeEditor";
import WorkSpace from "./pages/WorkSpace/WorkSpace";
import "./App.css";

function App() {
    return (
        // <Router>
        //     <Routes>
        //         <Route path="/" element={<SignIn />} />
        //         <Route path="/sign-up" element={<SignUp />} />
        //         <Route
        //             path="/sign-up/verify-email/:emailAddress"
        //             element={<VerifyEmail />}
        //         />
        //         <Route path="/forgot-password" element={<ResetPassword />} />
        //         <Route
        //             path="/forgot-password/change-password/:emailAddress"
        //             element={<ChangePassword />}
        //         />
        //     </Routes>
        // </Router>
        <WorkSpace />
    );
}

export default App;
