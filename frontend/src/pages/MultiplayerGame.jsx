import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  "http://localhost:3000";

const socket = io(SERVER_URL);

function MultiplayerGame({ goHome }) {
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(null);

  const [player, setPlayer] = useState(null);

  const [board, setBoard] = useState(
    Array(9).fill(null)
  );

  const [turn, setTurn] = useState("X");

  const [winner, setWinner] = useState(null);

  const [draw, setDraw] = useState(false);

  const [message, setMessage] = useState("");

  const [gameReady, setGameReady] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  // ===============================
  // CREATE ROOM
  // ===============================

  const createRoom = () => {
    const newRoomId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    socket.emit(
      "createRoom",
      newRoomId,
      (response) => {
        if (response.success) {
          setJoinedRoom(newRoomId);

          setPlayer("X");

          setGameReady(false);

          setMessage(
            "Waiting for another player..."
          );
        } else {
          setMessage(response.message);
        }
      }
    );
  };

  // ===============================
  // JOIN ROOM
  // ===============================

  const joinRoom = () => {
    const cleanRoomId = roomId
      .trim()
      .toUpperCase();

    if (!cleanRoomId) {
      setMessage(
        "Please enter a room code"
      );

      return;
    }

    socket.emit(
      "joinRoom",
      cleanRoomId,
      (response) => {
        if (response.success) {
          setJoinedRoom(cleanRoomId);

          setPlayer("O");

          setMessage(
            "Joined room successfully"
          );
        } else {
          setMessage(response.message);
        }
      }
    );
  };

  // ===============================
  // PLAYER MOVE
  // ===============================

  const handleMove = (index) => {
    if (!joinedRoom) return;

    if (!gameReady) return;

    if (winner || draw) return;

    if (turn !== player) return;

    if (board[index] !== null) return;

    socket.emit("makeMove", {
      roomId: joinedRoom,
      index,
    });
  };

  // ===============================
  // RESTART
  // ===============================

  const restartGame = () => {
    if (!gameReady) return;

    socket.emit(
      "restartGame",
      joinedRoom
    );
  };

  // ===============================
  // COPY ROOM CODE
  // ===============================

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(
        joinedRoom
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setMessage(
        "Could not copy room code"
      );
    }
  };

  // ===============================
  // SOCKET EVENTS
  // ===============================

  useEffect(() => {
    socket.on(
      "gameReady",
      ({ board, turn }) => {
        setBoard([...board]);

        setTurn(turn);

        setWinner(null);

        setDraw(false);

        setGameReady(true);

        setMessage(
          "Both players connected. Game started!"
        );
      }
    );

    socket.on(
      "gameUpdate",
      ({
        board,
        turn,
        winner,
        draw,
      }) => {
        setBoard([...board]);

        setTurn(turn);

        setWinner(winner);

        setDraw(draw);
      }
    );

    socket.on("playerLeft", () => {
      setGameReady(false);

      setMessage(
        "Opponent disconnected"
      );
    });

    return () => {
      socket.off("gameReady");
      socket.off("gameUpdate");
      socket.off("playerLeft");
    };
  }, []);

  // ===============================
  // ROOM SELECTION PAGE
  // ===============================

  if (!joinedRoom) {
    return (
      <div className="multiplayer-container">

        <h1>Multiplayer</h1>

        <p>
          Create a private room or join
          using a room code.
        </p>

        <button
          className="main-button"
          onClick={createRoom}
        >
          Create Room
        </button>

        <div className="divider">
          OR
        </div>

        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomId}
          maxLength={6}
          onChange={(e) =>
            setRoomId(
              e.target.value.toUpperCase()
            )
          }
        />

        <button
          className="main-button"
          onClick={joinRoom}
        >
          Join Room
        </button>

        {message && (
          <p>{message}</p>
        )}

        <button
          className="back-button"
          onClick={goHome}
        >
          ← Back to Home
        </button>

      </div>
    );
  }

  // ===============================
  // WAITING SCREEN
  // ===============================

  if (!gameReady) {
    return (
      <div className="multiplayer-container">

        <h1>Waiting for Opponent</h1>

        <p>
          Share this room code with
          your friend
        </p>

        <div className="room-code">
          {joinedRoom}
        </div>

        <button
          className="main-button"
          onClick={copyRoomCode}
        >
          {copied
            ? "Copied ✓"
            : "Copy Room Code"}
        </button>

        <p>
          {message}
        </p>

        <button
          className="back-button"
          onClick={goHome}
        >
          ← Back to Home
        </button>

      </div>
    );
  }

  // ===============================
  // GAME SCREEN
  // ===============================

  return (
    <div className="game-container">

      <h1>
        Multiplayer Game
      </h1>

      <div className="room-code">
        ROOM: {joinedRoom}
      </div>

      <p>
        You are:
        <strong> {player}</strong>
      </p>

      {winner ? (
        <h2>
          {winner === player
            ? "You Win 🎉"
            : "Opponent Wins"}
        </h2>
      ) : draw ? (
        <h2>
          Match Draw 🤝
        </h2>
      ) : (
        <h2>
          {turn === player
            ? "Your Turn"
            : "Opponent's Turn"}
        </h2>
      )}

      <div className="board">

        {board.map(
          (value, index) => (
            <button
              key={index}
              className="square"
              onClick={() =>
                handleMove(index)
              }
            >
              {value}
            </button>
          )
        )}

      </div>

      <div className="game-actions">

        <button
          className="reset-button"
          onClick={restartGame}
        >
          Rematch
        </button>

        <button
          className="back-button"
          onClick={goHome}
        >
          Back to Home
        </button>

      </div>

      {message && (
        <p>{message}</p>
      )}

    </div>
  );
}

export default MultiplayerGame;