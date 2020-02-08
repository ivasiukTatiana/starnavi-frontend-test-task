import React from 'react';

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

export default function ControlPanel(props) {
  return (
    <div className="control-panel">
      <form className="form">
        <Select
          value={props.selectedMode}
          onChange={props.handleChange}
          options={props.options}
        />
        <input type="text" name="user" className="form-control"
          value={props.user}
          onChange={props.handleChange}
          placeholder="Enter your name"
          autoFocus
        />
        <button type="button" onClick={props.onClick}>
          {props.button}
        </button>
      </form>
    </div>
  )
}
