import { useState } from 'react';

let moveLocation = new Array(10);
let moveLocationCount = 1;
moveLocation[0] = " ";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    let temp = "Player " + nextSquares[i] + ", Row: "
     + parseInt((i / 3) + 1) + ", Column: " + (i % 3);
    moveLocation[moveLocationCount] = temp;
    moveLocationCount++;

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner === "tie"){
    status = "Game ends in a tie";
  }
  else if (winner) {
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const row = [];
  for (let i = 0; i < 3; i++) {
    let temp = [];
    for (let j = 0; j < 3; j++) {
      temp[j] = <Square value={squares[j + (i * 3)]}
        onSquareClick={() => handleClick(j + (i * 3))} />
    }
    row[i] = temp;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {row[0]}
      </div>
      <div className="board-row">
        {row[1]}
      </div>
      <div className="board-row">
        {row[2]}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [order, setOrder] = useState(0);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <div>
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
          {" " + moveLocation[move]}
        </li>
      </div>
    );
  });

  let moveNumber;
      moveNumber = 'You are at move #' + currentMove;
  if (order === 1){
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          <button onClick=
            {() => {if (order === 0) {setOrder(1)} else{setOrder(0)}}}>
            {"Reverse Order of List"}
          </button>
          {moves}
          <div className="moveNumber">{moveNumber}</div>
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  let check = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === "X" || squares[i] === "O"){
      check++;
    }
  }
  if (check === 9){
    return "tie";
  }
  return null;
}
