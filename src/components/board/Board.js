import React from 'react';
import './Board.css';

function Square(props) {
  return (
    <div className="square"
      style={{backgroundColor: props.fieldColor}}
      onClick={props.onClick}>
    </div>
  )
}

export default function Board(props) {
  const squares = props.squares;
  return (
    <div className="board">
      {squares.map((boardRow, row) => {
        return (
          <div key={row} className="board-row">
            {boardRow.map((square, column) => {
              return(
                <Square key={column}
                  fieldColor={square}
                  onClick={() => props.onClick(row, column)}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
