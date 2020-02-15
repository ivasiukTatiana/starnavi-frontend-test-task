import React from 'react';

import './ControlPanel.css';

function Select(props) {
  return (
    <select name={props.name}
      className={props.class}
      value={props.value}
      onChange={props.onChange}
    >
      <option disabled hidden>Pick game mode</option>
      {props.options.map((option, index) => {
        return (
          <option key={index} value={option}>{option.slice(0, option.length - 4)}</option>
        )
      })}
    </select>
  )
}

export default function ControlPanel(props) {
  return (
    <form>
      <Select name="selectedMode" class="form-control"
        value={props.selectedMode}
        onChange={props.handleChange}
        options={props.options}
      />
      <input type="text" name="user" maxLength="20"
        className="form-control"
        value={props.user}
        onChange={props.handleChange}
        placeholder="Enter your name"
        autoFocus
      />
      <button type="button" onClick={props.onClick}>
        {props.button}
      </button>
    </form>
  )
}
