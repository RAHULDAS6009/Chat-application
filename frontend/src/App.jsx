import { Route, Routes } from "react-router-dom";
import  ChatPage  from "./pages/ChatPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;
