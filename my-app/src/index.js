import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
  <button className="square" 
  onClick={() => props.onClick() }>
    {props.value}
  </button>);
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={ ()=> {this.props.onClick(i)}}/>;
  }

  render() {
    
    // let status = this.state.status;
    return (
      <div>
        <div className="status"></div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }

  
}
  
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{squares: Array(9).fill(null), moveNoIndex: null}],
      xIsNext: true,
      status: 'Next player: X',
      stepNo: 0
    };
  }
  jumpTo(stepNo){
    this.setState({
      stepNo: stepNo,
      xIsNext: (stepNo % 2) === 0
    })
  }

  getMoveLocation(moveNoIndex){
    const row = Math.floor(moveNoIndex/3)+1;
    const column = moveNoIndex%3 + 1;
    return {row: row, column: column};
  }

  displayLocation(moveNoIndex){
    const location = this.getMoveLocation(moveNoIndex);
    return '('+location.row+','+location.column+')';
  }

  render() {
    const current = this.state.history[this.state.stepNo];
    const moves = this.state.history.map((step, move) => {
        let desc = move ? 
            'Go to move #' + move + ' location:'+(this.displayLocation(step.moveNoIndex)) :
            'Go to game start';
        const fw = (this.state.stepNo === move) ? 'bold' : 'normal';
        return (
              <li key={move}>
                <button onClick={() => {this.jumpTo(move)}} style={{'fontWeight': fw}}>
                  {desc}
                </button>
              </li>
        )
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => {this.handleClick(i)} }/>
        </div>
        <div className="game-info">
          <div>{this.state.status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          {/* <ShoppingList name="Tiger" /> */}
        </div>
      </div>
      
    );
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNo+1);
    const squares = history[history.length-1].squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (squares[i] === 'O' ? 'X' : 'O');
    }

    this.setState({
      history: history.concat([{squares: squares, moveNoIndex: i}]),
      xIsNext: !this.state.xIsNext,
      status: status,
      stepNo: history.length
    });
  }
}

 // eslint-disable-next-line
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
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
      return squares[a];
    }
  }
  return null;
}
