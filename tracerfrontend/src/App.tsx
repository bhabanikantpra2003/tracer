import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import SignIn from "./pages/SignIn";
import Signup from "./pages/Signup";
import History from "./pages/History";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<div>jay gay</div>} />
    </Routes>
  );
};

export default App;
