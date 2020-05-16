import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// This function will create a square button for the Tic Tac Toe game
function Square(props) {
    // This will apply the css class depending on the highlight props
    const className = 'square' + (props.highlight ? ' highlight' : '');
    return (
      // alert('click'): show a dialog box that says 'click' when clicked
      // replace with this.setState({...})
      <button
        className={className}
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

// This will create a board of squares
class Board extends React.Component {

  renderSquare(i) {
    const winLine = this.props.winLine;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={winLine && winLine.includes(i)}
      />
    );
  }

// This changed from hardcoded rows and columns to two loops (3x3)
  render() {
      // Use two loops to make the squares
      const boardSize = 3;
      let squares = [];
      for (let i=0; i < boardSize; ++i) {
        let row = [];
        for(let j=0; j < boardSize; ++j)  {
          row.push(this.renderSquare(i * boardSize + j));
        }
        squares.push(<div key={i} className="board-row">{row}</div>);
      }
    return (
      <div>{squares}</div>
    );
  }
}

// This will be the composite of Board and rules of Tic-Tac-Toe
class Game extends React.Component {
  constructor(props)  {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true
    };
  }

// When clicking on a square, X or O will be added
  handleClick(i)  {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        recentMove: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

// When selecting a button, it will jump to that particular step
  jumpTo(step)  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

// This will determine the toggle whether descending or ascending
  handleSortToggle()  {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[this.state.stepNumber];
    const winInfo = calculateWinner(current.squares);
    const winner = winInfo.winner;

    // changes const to let to account for isAscending
    let moves = history.map((step, move) => {
      const latestMove = step.recentMove;
      const col = (latestMove % 3) + 1;
      const row = Math.floor(latestMove / 3) + 1;
      const desc = move ?
        `Go to move #${move} Put on (${col}, ${row})` :
        'Go to game start';
      return (
        <li key={move}>
          <button
            className={move === stepNumber ? 'move-current-item' : ''}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    const isAscending = this.state.isAscending;
    // Changes order of moves when toggled
    if (!isAscending) {
      moves.reverse();
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      if (winInfo.isDraw) {
        status = "Draw";
      } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winInfo.line}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}>
            {isAscending ? 'descending' : 'ascending'}
          </button>
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
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
        };
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++)  {
    if (squares[i] === null)  {
      isDraw = false;
      break;
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
}
