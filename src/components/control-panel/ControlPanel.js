import React, {Component} from 'react';

function Select(props) {
  return (
    <select name="selectedMode" className="form-control"
      value={props.value}
      onChange={props.onChange}
    >
      <option disabled hidden>Pick game mode</option>
      {props.options.map((option, index) => {
        return (
          <option key={index} value={option}>{option}</option>
        )
      })}
    </select>
  )
}

export default class ControlPanel extends Component {

  render() {
    return (
      <div className="control-panel">
        <form className="form">
          <Select
            value={this.props.selectedMode}
            onChange={this.props.handleChange}
            options={this.props.options}
          />

          <input type="text" name="user" className="form-control"
            value={this.props.user}
            onChange={this.props.handleChange}
            placeholder="Enter your name"
            autoFocus />

          <button type="button" onClick={this.props.onClick}>
            {this.props.button}
          </button>
        </form>
      </div>
    )
  }
}
