import React from 'react';

export default function LeaderBoard(props) {
  return (
    <table className="leader-board">
      <caption>Leader Board</caption>
      <tbody>
        {props.winners.map((winner, index) => {
          return(
            <tr key={index}>
              <td>{winner.winner}</td>
              <td>{winner.date}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
