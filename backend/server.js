const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tic Tac Toe backend is running 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// =============================
// ROOM DATA
// =============================

const rooms = {};

// =============================
// CHECK WINNER
// =============================

const checkWinner = (board) => {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningPatterns) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }

  return null;
};

// =============================
// SOCKET.IO
// =============================

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // =============================
  // CREATE ROOM
  // =============================

  socket.on("createRoom", (roomId, callback) => {
    if (rooms[roomId]) {
      callback({
        success: false,
        message: "Room already exists",
      });

      return;
    }

    rooms[roomId] = {
      players: [socket.id],
      board: Array(9).fill(null),
      turn: "X",
    };

    socket.join(roomId);

    callback({
      success: true,
      player: "X",
      roomId,
    });

    console.log(
      `${socket.id} created room ${roomId}`
    );
  });

  // =============================
  // JOIN ROOM
  // =============================

  socket.on("joinRoom", (roomId, callback) => {
    const room = rooms[roomId];

    if (!room) {
      callback({
        success: false,
        message: "Room does not exist",
      });

      return;
    }

    if (room.players.length >= 2) {
      callback({
        success: false,
        message: "Room is full",
      });

      return;
    }

    room.players.push(socket.id);

    socket.join(roomId);

    callback({
      success: true,
      player: "O",
      roomId,
    });

    io.to(roomId).emit("gameReady", {
      board: room.board,
      turn: room.turn,
    });

    console.log(
      `${socket.id} joined room ${roomId}`
    );
  });

  // =============================
  // MAKE MOVE
  // =============================

  socket.on("makeMove", ({ roomId, index }) => {
    const room = rooms[roomId];

    if (!room) {
      return;
    }

    const playerIndex =
      room.players.indexOf(socket.id);

    if (playerIndex === -1) {
      return;
    }

    const player =
      playerIndex === 0 ? "X" : "O";

    if (room.turn !== player) {
      return;
    }

    if (room.board[index] !== null) {
      return;
    }

    room.board[index] = player;

    const winner =
      checkWinner(room.board);

    const draw =
      !winner &&
      room.board.every(
        (cell) => cell !== null
      );

    if (!winner && !draw) {
      room.turn =
        room.turn === "X" ? "O" : "X";
    }

    io.to(roomId).emit("gameUpdate", {
      board: room.board,
      turn: room.turn,
      winner,
      draw,
    });
  });

  // =============================
  // RESTART GAME
  // =============================

  socket.on("restartGame", (roomId) => {
    const room = rooms[roomId];

    if (!room) {
      return;
    }

    room.board =
      Array(9).fill(null);

    room.turn = "X";

    io.to(roomId).emit("gameUpdate", {
      board: room.board,
      turn: room.turn,
      winner: null,
      draw: false,
    });
  });

  // =============================
  // DISCONNECT
  // =============================

  socket.on("disconnect", () => {
    console.log(
      "Player disconnected:",
      socket.id
    );

    for (const roomId in rooms) {
      const room = rooms[roomId];

      if (
        room.players.includes(socket.id)
      ) {
        room.players =
          room.players.filter(
            (id) => id !== socket.id
          );

        io.to(roomId).emit(
          "playerLeft"
        );

        if (
          room.players.length === 0
        ) {
          delete rooms[roomId];
        }
      }
    }
  });
});

// =============================
// START SERVER
// =============================

const PORT =
  process.env.PORT || 3000;

server.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);