import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const NUM = 20;
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(NUM * NUM).fill(null),
      xIsNext: true,
      winner: null,
    }
  }
  handleClick(i) {
    const squares = [...this.state.squares];
    if (this.state.winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const { winner, index } = calculateWinner2(i, squares, this);
    console.log(winner, index);
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      winner: winner,
    }, () => {
      if (index === null) {
        return;
      }
      const squaresEle = document.getElementsByClassName('square');
      squaresEle[index].classList.add('red');
    });

  }
  renderSquare(i) {
    return (
      <Square
        key={i.toString()}
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
  reStart() {
    const xIsNext = this.state.winner === 'X' ? false : true;
    this.setState({
      squares: Array(NUM * NUM).fill(null),
      xIsNext: xIsNext,
      winner: null,
    });
  }

  render() {
    let status;
    if (this.state.winner) {
      status = 'GameOver Winner: ' + this.state.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const arr = [];
    for (let index = 0; index < NUM; index++) {
      arr.push(index);
    }


    return (
      <div>
        <div className="status">
          <span>{status}</span>
          {(this.state.winner ? <span className="re-start" onClick={() => this.reStart()}> reStart</span> : '')}

        </div>
        {
          arr.map((item) => {
            return (<div className="board-row" key={item.toString()}>
              {
                arr.map((v) => {
                  return this.renderSquare(item * NUM + v);
                })
              }
            </div>)
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
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


function cleft(i, left, squares) {
  let counts = 0;
  for (let j = 1; j <= left; j++) {
    if (squares[i] === squares[i - j] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}
function cright(i, right, squares) {
  let counts = 0;
  for (let j = 1; j <= right; j++) {
    if (squares[i] === squares[i + j] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}

function cup(i, up, squares) {
  let counts = 0;
  for (let j = 1; j <= up; j++) {
    if (squares[i] === squares[i - j * NUM] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}

function cdown(i, down, squares) {
  let counts = 0;
  for (let j = 1; j <= down; j++) {
    if (squares[i] === squares[i + j * NUM] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}

function cleftup(i, leftup, squares) {
  let counts = 0;
  for (let j = 1; j <= leftup; j++) {
    if (squares[i] === squares[i - j * (NUM + 1)] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}

function crightdown(i, rightdown, squares) {
  let counts = 0;
  for (let j = 1; j <= rightdown; j++) {
    if (squares[i] === squares[i + j * (NUM + 1)] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}

function cleftdown(i, leftdown, squares) {
  let counts = 0;
  for (let j = 1; j <= leftdown; j++) {
    if (squares[i] === squares[i + j * (NUM - 1)] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}

function crightup(i, rightup, squares) {
  let counts = 0;
  for (let j = 1; j <= rightup; j++) {
    if (squares[i] === squares[i - j * (NUM - 1)] && j <= 4) {
      counts++;
    } else {
      break;
    }
  }
  return counts;
}

function calculateWinner2(i, squares) {
  const left = i % NUM;
  const right = NUM - 1 - left;
  const leftcount = cleft(i, left, squares);
  const rightcount = cright(i, right, squares);

  const up = Math.floor(i / NUM);
  const down = NUM - 1 - up;
  const upcount = cup(i, up, squares);
  const downcount = cdown(i, down, squares);

  // 右斜
  const leftup = left > up ? up : left;
  const rightdown = right > down ? down : right;
  const leftupcount = cleftup(i, leftup, squares);
  const rightdowncount = crightdown(i, rightdown, squares);

  // 左斜
  const leftdown = left > down ? down : left;
  const rightup = right > up ? up : right;
  const leftdowncount = cleftdown(i, leftdown, squares);
  const rightupcount = crightup(i, rightup, squares);

  if (leftcount + rightcount >= 4 || upcount + downcount >= 4 || leftupcount + rightdowncount >= 4 || leftdowncount + rightupcount >= 4) {
    return {
      winner: squares[i],
      index: i,
    };
  }

  return {
    winner: null,
    index: null,
  };
}


