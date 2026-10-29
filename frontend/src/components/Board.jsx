import { useEffect, useState } from "react";
import {
  checkWinner,
  getBestMove,
} from "../utils/minimax";

function Board({ goHome }) {
  const [board, setBoard] = useState(
    Array(9).fill(null)
  );

  const [isPlayerTurn, setIsPlayerTurn] =
    useState(true);

  const [difficulty, setDifficulty] =
    useState("hard");

  const winner = checkWinner(board);

  const isDraw =
    !winner &&
    board.every((cell) => cell !== null);

  const handleClick = (index) => {
    if (
      board[index] ||
      winner ||
      isDraw ||
      !isPlayerTurn
    ) {
      return;
    }

    const newBoard = [...board];

    newBoard[index] = "X";

    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const getRandomMove = (currentBoard) => {
    const emptyCells = [];

    currentBoard.forEach((cell, index) => {
      if (cell === null) {
        emptyCells.push(index);
      }
    });

    if (emptyCells.length === 0) {
      return null;
    }

    const randomIndex =
      Math.floor(
        Math.random() * emptyCells.length
      );

    return emptyCells[randomIndex];
  };

  useEffect(() => {
    if (
      isPlayerTurn ||
      winner ||
      isDraw
    ) {
      return;
    }

    const timer = setTimeout(() => {
      const newBoard = [...board];

      let computerMove;

      if (difficulty === "easy") {
        computerMove =
          getRandomMove(newBoard);
      } else {
        computerMove =
          getBestMove(newBoard);
      }

      if (computerMove !== null) {
        newBoard[computerMove] = "O";
      }

      setBoard(newBoard);
      setIsPlayerTurn(true);
    }, 500);

    return () => clearTimeout(timer);

  }, [
    board,
    isPlayerTurn,
    winner,
    isDraw,
    difficulty,
  ]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  const changeDifficulty = (level) => {
    setDifficulty(level);
    resetGame();
  };

  return (
    <div className="game-container">

      <h1>
        Play vs Computer
      </h1>

      <p>
        You are <strong>X</strong>
        {" | "}
        Computer is <strong>O</strong>
      </p>

      <div className="difficulty">

        <button
          className={
            difficulty === "easy"
              ? "difficulty-btn active"
              : "difficulty-btn"
          }
          onClick={() =>
            changeDifficulty("easy")
          }
        >
          Easy
        </button>

        <button
          className={
            difficulty === "hard"
              ? "difficulty-btn active"
              : "difficulty-btn"
          }
          onClick={() =>
            changeDifficulty("hard")
          }
        >
          Hard
        </button>

      </div>

      {winner ? (
        <h2>
          {winner === "X"
            ? "You Win 🎉"
            : "Computer Wins 🤖"}
        </h2>
      ) : isDraw ? (
        <h2>
          Match Draw 🤝
        </h2>
      ) : (
        <h2>
          {isPlayerTurn
            ? "Your Turn"
            : "Computer Thinking..."}
        </h2>
      )}

      <div className="board">

        {board.map(
          (value, index) => (
            <button
              key={index}
              className="square"
              onClick={() =>
                handleClick(index)
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
          onClick={resetGame}
        >
          Restart Game
        </button>

        <button
          className="back-button"
          onClick={goHome}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default Board;