import "./App.css";
import { useState } from "react";
import MainBoard from "./pages/MainBoard/MainBoard";
import AnimatedBackground from "./components/AnimatedBackground/AnimatedBackground";
import ChatBox from "./components/ChatBox/ChatBox";

function App() {
  const [showChat, setShowChat] = useState(true);

  return (
    <AnimatedBackground>
      <div className="App">
        <MainBoard />
        <ChatBox />
      </div>
    </AnimatedBackground>
  );
}

export default App;
