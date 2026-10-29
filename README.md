# 🎮 Tic Tac Toe Arena

A full-stack Tic Tac Toe application featuring an AI-powered computer mode and real-time multiplayer gameplay.

The project started as a C++ console-based Tic Tac Toe game and was later extended into a modern web application using React, Node.js, Express, and Socket.IO.

---

## 🚀 Features

### 🤖 Play vs Computer

- Player plays as `X`
- Computer plays as `O`
- Easy difficulty using random moves
- Hard difficulty using the Minimax algorithm
- Win detection
- Draw detection
- Restart game
- Responsive interface

### 👥 Real-Time Multiplayer

- Create private game rooms
- Generate unique room codes
- Join games using room codes
- Real-time moves using Socket.IO
- Automatic X/O assignment
- Server-side turn validation
- Win and draw detection
- Rematch functionality
- Opponent disconnect handling
- Copy room code
- Waiting-for-opponent screen

### 💻 C++ Version

The project also includes the original console-based Tic Tac Toe implementation written in C++.

---

## 🛠 Tech Stack

### Frontend

- React
- JavaScript
- Vite
- CSS

### Backend

- Node.js
- Express.js
- Socket.IO

### Algorithms

- Minimax Algorithm
- Game-state evaluation
- Win/draw detection

### Other

- C++
- Git
- GitHub

---

## 🧠 Minimax Algorithm

The Hard AI mode uses the Minimax algorithm to determine the best possible move.

The computer evaluates future game states recursively.

Scoring:

```text
Computer Win = +10
Player Win   = -10
Draw         = 0
