import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// Functional Component
// https://reactjs.org/tutorial/tutorial.html#functional-components
function Square(props) {
  const squareStyle = {};
  if (props.winningSquare === true) {
    squareStyle['backgroundColor'] = 'yellow';
  }
  return (
    <button className="square"
            style={squareStyle}
            onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winningSquare = false) {
    return <Square value={this.props.squares[i]}
                   winningSquare={winningSquare}
                   onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        {[0, 1, 2].map((y) => {
          return <div className="board-row">
            {[0, 1, 2].map((x) => {
              const position = x + 3*y;
              const isWinningSquare = this.props.winner && this.props.winner.includes(position);
              return this.renderSquare(position, isWinningSquare)
            })}
          </div>
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMove: null
      }],
      stepNumber: 0,
      movesInAccendingOrder: true,
      xIsNext: true
    }
  }

  handleBoardClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const moveChar = this.state.xIsNext ? 'X' : 'O';
    const position = `(${i % 3},${parseInt(i / 3)})`
    squares[i] = moveChar;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMove: `${moveChar} at position ${position}`
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleToggleClick() {
    this.setState({
      movesInAccendingOrder: !this.state.movesInAccendingOrder
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `Go to move #${move}: ${step.lastMove}` : 'Go to game start';
      const fontWeight = (move === history.length - 1) ? "bold" : "normal";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}
                  style={{ "fontWeight": fontWeight }}>{desc}</button>
        </li>
      )
    });
    if (!this.state.movesInAccendingOrder) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = `Winner: ${current.squares[winner[0]]}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    const moveOrderButton = `Show Moves in ${this.state.movesInAccendingOrder ? 'Descending' : 'Ascending'} Order`

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
                 winner={winner}
                 onClick={(i) => this.handleBoardClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleToggleClick()}>{moveOrderButton}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
