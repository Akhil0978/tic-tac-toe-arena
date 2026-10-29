import { useState } from "react";

import Board from "../components/Board";
import MultiplayerGame from "./MultiplayerGame";

function Home() {
  const [mode, setMode] = useState(null);

  if (mode === "computer") {
    return (
      <Board
        goHome={() => setMode(null)}
      />
    );
  }

  if (mode === "multiplayer") {
    return (
      <MultiplayerGame
        goHome={() => setMode(null)}
      />
    );
  }

  return (
    <div className="home">
      <h1>Tic Tac Toe Arena</h1>

      <p>Choose Game Mode</p>

      <div className="mode-buttons">
        <button
          onClick={() =>
            setMode("computer")
          }
        >
          🤖 Play vs Computer
        </button>

        <button
          onClick={() =>
            setMode("multiplayer")
          }
        >
          👥 Play with Friend
        </button>
      </div>
    </div>
  );
}

export default Home;