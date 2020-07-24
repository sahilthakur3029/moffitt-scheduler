import React from "react";

import "./Builder.css";

var abbrevs = {
  Monday: "mon",
  Tuesday: "tue",
  Wednesday: "wed",
  Thursday: "thu",
  Friday: "fri",
  Saturday: "sat",
  Sunday: "sun"
};

class Builder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="options-bar">
          <LoadAndSave />
          <Libraries selected="moffitt3" />
        </div>
        <Calendar />
      </div>
    );
  }
}

function Calendar(props) {
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  var dayLabels = [<th></th>]; // The first column is for time labels
  for (var i = 0; i < days.length; i++) {
    dayLabels.push(<DayLabel day={days[i]} />);
  }

  var tableContents = [];
  for (var t = 0; t < 24; t += 0.5) {
    var time = [<TimeLabel time={t} />];
    for (var d = 0; d < days.length; d++) {
      var names = ["Brian", "Bianca", "Parth"];
      if (d % 2 !== 0) {
        names = ["Brian", "Bianca"];
      } else if (d % 3 !== 0 && t === 1) {
        names = ["Brian", "Bianca", "Parth", "Elena"];
      }

      time.push(
        <Slot open={true} day={abbrevs[days[0]]} time={t} names={names} />
      );
    }
    tableContents.push(<tr>{time}</tr>);
  }

  return (
    <table>
      <thead>
        <tr>{dayLabels}</tr>
      </thead>
      <tbody>{tableContents}</tbody>
    </table>
  );
}

// open: whether or not the library is currently open
// day: 3 lowercase letters for day of week (i.e mon)
// time: number (in military) time, representing the time of the day (.5 used for half hour)
// names: The names of the employees working that slot
function Slot(props) {
  var names = [];
  for (var i = 0; i < props.names.length; i++) {
    names.push(<p>{props.names[i]}</p>);
  }

  return (
    <td className="slot-cont">
      <div className="slot">{names}</div>
    </td>
  );
}

// day: the day of the week (i.e. Sunday)
function DayLabel(props) {
  return (
    <td className="day-cont">
      <div className="day-label">{props.day}</div>
    </td>
  );
}

// time: the time of the day in military time
function TimeLabel(props) {
  var time = props.time;
  var period = "AM";
  if (time >= 12) {
    period = "PM";
  }

  if (time >= 13) {
    time -= 12;
  }

  if (time == 0 || time == 0.5) {
    time += 12;
  }

  var minutes = "30";
  var hour = Math.floor(time);
  if (hour == time) {
    minutes = "00";
  }

  return (
    <td className="time-cont">
      <div className="time-label">{hour + ":" + minutes + " " + period}</div>
    </td>
  );
}

function LoadAndSave(props) {
  return (
    <div className="load-save">
      <table>
        <tbody>
          <tr>
            <td>Load Schedule:</td>
            <td>
              <input type="text" name="load-schedule" />
            </td>
            <td>
              <button className="builder-button">Load</button>
            </td>
          </tr>
          <tr>
            <td>
              <label>Save As: </label>
            </td>
            <td>
              <input type="text" name="save-schedule" />
            </td>
            <td>
              <button className="builder-button">Save</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Libraries(props) {
  return (
    <div className="libraries">
      <button className={props.selected === "moffitt3" ? "selected" : null}>
        Moffitt 3
      </button>
      <button className={props.selected === "moffitt4" ? "selected" : null}>
        Moffitt 4
      </button>
      <button className={props.selected === "main" ? "selected" : null}>
        Main Stacks
      </button>
    </div>
  );
}

export default Builder;
