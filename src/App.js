import React, {Component} from 'react';

import './App.css';
import Board from './components/board/Board';
import ControlPanel from './components/control-panel/ControlPanel';
import LeaderBoard from './components/leader-board/LeaderBoard';

const defaultMode = {field: 5, delay: 2000};
const url = 'https://starnavi-frontend-test-task.herokuapp.com';
const urlSettings = '/game-settings';
const urlWinners = '/winners';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: defaultMode,
      selectedMode: "Pick game mode",
      modes: {},
      user: "",
      message: {
        text: "",
        background: "#f00"
      },
      button: "PLAY",
      points: {
        user: 0,
        computer: 0
      },
      squares: Array.from(Array(defaultMode.field), () => Array(defaultMode.field).fill('#fff')),
      winners: [],
    }

    this.getData = this.getData.bind(this);
    this.handleBoardClick = this.handleBoardClick.bind(this);
    this.changeSquareColor = this.changeSquareColor.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  componentDidMount() {
    this.getData(url + urlSettings, 'modes');
    this.getData(url + urlWinners, 'winners');
  }

  /**
  * Method gets data from the server and sets them to the state
  * @param endpoint { string } - endpoint
  * @param nameProperty { string } - property name
  * @return void
  */
  getData(endpoint, nameProperty) {
    fetch(endpoint)
      .then(response => {
        return response.json()
      })
      .then(response => {
        this.setState({
          [nameProperty]: response
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  /**
  * @function handleFormChange
  * @param event { obj } - change event
  * @return void
  */
  handleFormChange(event) {
    const key = event.target.name;
    const value = event.target.value;
    this.setState({ [key]: value });
    if (this.state.modes.hasOwnProperty(value)) {
      const mode = {...this.state.modes[value]};
      this.setState({
        mode: mode,
      }, () => {
        this.gameReset();
      });
    }
  }

  /**
  * Function starts the game
  * @return void
  */
  handleButtonStart = () => {
    this.gameReset();
    let {field, delay} = this.state.mode;
    const changeSquareColor = this.changeSquareColor.bind(this);
    const gameOver = this.gameOver.bind(this);
    setTimeout(function startGame() {
      let row = parseInt(Math.random() * field);
      let column = parseInt(Math.random() * field);
      let winner = changeSquareColor(row, column, '#00f');

      if (winner === 0) {
        setTimeout(() => {
          winner = changeSquareColor(row, column, '#f00');
          setTimeout(startGame);
        }, delay);
      } else if (winner > 0) {
        gameOver(winner);
        return;
      } else {
        setTimeout(startGame);
      }
    });
  }

  /**
  * Function changes color of square and counts points
  * @param i { number } - row on board
  * @param j { number } - column on board
  * @param color { string } - new color
  * @return number|null - winner is 1-Computer, 2-User, 0|null - no winner yet
  */
  changeSquareColor = (i, j, color) => {
    const points = {...this.state.points};
    const totalFields = Math.pow(this.state.mode.field, 2);
    if (points.computer > totalFields * 0.5) {
      return 1;
    } else if (points.user > totalFields * 0.5) {
      return 2;
    }

    if ((color === '#0f0')
        || (color === '#00f' && this.state.squares[i][j] === '#fff')
        || (color === '#f00' && this.state.squares[i][j] === '#00f')) {

      const squares = [...this.state.squares];
      const squaresRow = [...squares[i]];
      squaresRow[j] = color;
      squares[i] = squaresRow;

      switch (squares[i][j]) {
        case '#f00':
          points.computer += 1;
          break;
        case '#0f0':
          points.user += 1;
          break;
        default:
      }
      this.setState({
        squares: squares,
        points: points
      });
      return 0;
    }
    return null;
  }

  /**
  * Method handles user's click
  * @param i { number } - row on board
  * @param j { number } - column on board
  * @return void
  */
  handleBoardClick(i, j) {
    if (this.state.squares[i][j] === '#00f') {
      this.changeSquareColor(i, j, '#0f0');
    }
  }

  /**
    * Function ends the game and sends the winner and date to the server
    * @param winner { number } - 1: Computer is winner | 2: User is winner
    * @return void
    */
  gameOver = (winner) => {
    let now = Date.now();
    let options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    let nowTime = new Intl.DateTimeFormat('en-GB', options).format(now);
    options = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    let nowDate = new Intl.DateTimeFormat('en-GB', options).format(now);

    const objWinner = {
      winner: "Computer",
      date: `${nowTime}; ${nowDate}`
    };
    let message = {
      text: "Game over. I won!!!!!!!",
      background: "#ffb7b7"
    };
    if (winner === 2) {
      message = {
        text: "Congratulations! You won!",
        background: "#b7ffb7"
      };
      this.state.user !== "" ? objWinner.winner = this.state.user : objWinner.winner = "User";
    }
    this.setState({
      button: 'PLAY AGAIN',
      message: message,
    });

    (async () => {
      try {
        let response = await fetch(url + urlWinners, {
          method: "POST",
          body: JSON.stringify(objWinner),
          headers: {
            "Content-Type": "application/json"
          }});
        let newWinners = await response.json();
        this.setState({
          winners: newWinners
        });
      } catch(err) {
        console.log(err);
      }
    })();
  }

  /**
  * Function resets game state to initial
  * @return void
  */
  gameReset = () => {
    let timeId = setTimeout(() => {});
    for (let i = 0; i < timeId; i++) clearTimeout(i);

    const field = this.state.mode.field;
    this.setState({
      button: 'PLAY',
      squares: Array.from(Array(field), () => Array(field).fill('#fff')),
      points: {
        user: 0,
        computer: 0
      },
      message: '',
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <ControlPanel
            onClick={this.handleButtonStart}
            handleChange={this.handleFormChange}
            options={Object.keys(this.state.modes)}
            selectedMode={this.state.selectedMode}
            user={this.state.user}
            button={this.state.button}
          />
          <p className="message"
            style={this.state.message.text !== '' ? {opacity: 1, backgroundColor: this.state.message.background} : {opacity: 0}}
          >
            {this.state.message.text}
          </p>
          <Board
            squares={this.state.squares}
            onClick={(i, j) => this.handleBoardClick(i, j)}
          />
        </div>
        <div>
          <LeaderBoard winners={this.state.winners} />
        </div>

      </div>
    );
  }
}
