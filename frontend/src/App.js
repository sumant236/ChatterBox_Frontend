import "./App.css";
import { Route, Routes } from "react-router-dom";
import Profilepage from "./Pages/Chatpage";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/profile" element={<Profilepage />}></Route>
        <Route path="/chats" element={<Chatpage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
