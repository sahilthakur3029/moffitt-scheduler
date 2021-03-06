import React from "react";
import "./OpenShiftsCal.css";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import Modal from "react-modal";
import { Redirect } from "react-router-dom";
import leftArrow from "./Arrows/leftarrow.svg";
import rightArrow from "./Arrows/rightarrow.svg";

function Timeslot(props) {
  function CovererRequest() {
    function refreshPage() {
      window.location.reload();
      return;
    }

    function yesClick() {
      console.log("In yes click");
      fetch("/api/updateopenshifts", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          shiftID: props.id
        })
      })
        .then(response => {
          return response.json();
        })
        .then(jsonResponse => {
          console.log(jsonResponse);
        });
      window.location.reload();
      return;
    }

    function afterOpenModal() {
      subtitle.style.color = "#black";
    }

    function openModal() {
      setIsOpen(true);
    }

    function closeModal() {
      setIsOpen(false);
    }

    const [modalIsOpen, setIsOpen] = React.useState(false);

    var subtitle;

    const customStyles = {
      content: {
        top: "40%",
        left: "50%",
        width: "25%",
        height: "35%",
        transform: "translate(-50%, -50%)",
        overflow: 0
      }
    };

    function timeStringify(num) {
      console.log(num);
      if (num === 0) {
        return "12:00AM";
      } else if (num > 24) {
        if (num % 2 === 0) {
          return ((num / 2) % 12) + ":00PM";
        } else {
          return (((num - 1) / 2) % 12) + ":30PM";
        }
      } else if (num === 24) {
        return "12:00PM";
      } else {
        if (num % 2 === 0) {
          return num / 2 + ":00AM";
        } else {
          return (num - 1) / 2 + ":30AM";
        }
      }
    }
    if (props.valid) {
      return (
        <div>
          <button className="AddButton" onClick={openModal}>
            <div className="a"></div>
          </button>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            {" "}
            <div>
              <h1
                className="AddEmpText"
                ref={_subtitle => (subtitle = _subtitle)}
              ></h1>
            </div>
            <div className="question">Would you like to cover this shift?</div>
            <div className="location">Location: {props.location}</div>
            <div className="startTime">
              Start Time: {timeStringify(props.start)}
            </div>
            <div className="endTime">End Time: {timeStringify(props.end)} </div>
            <div className="buttonContainer">
              <button className="YesButton" onClick={yesClick}>
                <div className="YesText">
                  <h4> Yes</h4>
                </div>
              </button>
              <button className="NoButton" onClick={refreshPage}>
                <div className="NoText">
                  <h4>No</h4>
                </div>
              </button>
            </div>
          </Modal>
        </div>
      );
    } else {
      return <div className="AddButton"></div>;
    }
  }
  if (props.valid) {
    return (
      <div class="open-shift" style={{ backgroundColor: props.color }}>
        <CovererRequest />
      </div>
    );
  } else {
    return (
      <div class="not-open-shift" style={{ backgroundColor: props.color }}>
        <CovererRequest />
      </div>
    );
  }
}

class Shift {
  constructor(color, id, start, end, day, sleid, location) {
    this.color = color;
    this.id = id;
    this.start = start;
    this.end = end;
    this.day = day;
    this.sleid = sleid;
    this.location = location;
  }
}

function initialShifts() {
  let a = [];
  for (var i = 0; i < 336; i += 1) {
    a.push(new Shift("#f8f8f8", null, null, null, null, null, null));
  }
  let count = 0;
  for (var i = 0; i <= 47; i += 1) {
    for (var j = 0; j <= 6; j += 1) {
      a[count].start = i;
      a[count].end = i + 1;
      a[count].day = j;
      count += 1;
    }
  }
  return a;
}

var emptyShifts = initialShifts();

export default class OpenShiftsCal extends React.Component {
  constructor(props) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    var weekString =
      format(currentDate, "MMMM") +
      " " +
      format(currentDate, "YYYY") +
      ": " +
      format(startOfWeek(currentDate), "MM/DD") +
      " - " +
      format(endOfWeek(currentDate), "MM/DD");
    super(props);
    this.state = {
      shifts: emptyShifts,
      currentDate: currentDate,
      weekString: weekString,
      emptyShifts: emptyShifts,
      redirect: null
    };
    this.previousWeek = this.previousWeek.bind(this);
    this.nextWeek = this.nextWeek.bind(this);
  }

  componentDidMount() {
    fetch("/api/openshifts", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: this.state.emptyShifts,
        currentDate: this.state.currentDate,
        startOfWeek: startOfWeek(this.state.currentDate),
        endOfWeek: endOfWeek(this.state.currentDate)
      })
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.shifts === null) {
          this.setState({ redirect: <Redirect push to="/login" /> });
        } else {
          this.setState({ shifts: jsonResponse.shifts });
        }
      });
  }
  previousWeek() {
    let currStartDate = new Date(this.state.currentDate);
    if (Date.parse(currStartDate) < Date.parse(new Date())) {
      return;
    }
    currStartDate.setDate(currStartDate.getDate() - 7);
    var weekStringg =
      format(currStartDate, "MMMM") +
      " " +
      format(currStartDate, "YYYY") +
      ": " +
      format(startOfWeek(currStartDate), "MM/DD") +
      " - " +
      format(endOfWeek(currStartDate), "MM/DD");
    fetch("/api/openshifts", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: this.state.emptyShifts,
        currentDate: currStartDate,
        startOfWeek: startOfWeek(currStartDate),
        endOfWeek: endOfWeek(currStartDate)
      })
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        this.setState({
          shifts: jsonResponse.shifts,
          currentDate: currStartDate,
          weekString: weekStringg
        });
      });
  }

  nextWeek() {
    let currStartDate = new Date(this.state.currentDate);
    currStartDate.setDate(currStartDate.getDate() + 7);
    var weekStringg =
      format(currStartDate, "MMMM") +
      " " +
      format(currStartDate, "YYYY") +
      ": " +
      format(startOfWeek(currStartDate), "MM/DD") +
      " - " +
      format(endOfWeek(currStartDate), "MM/DD");
    fetch("/api/openshifts", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: this.state.emptyShifts,
        userId: this.props.userId,
        currentDate: currStartDate,
        startOfWeek: startOfWeek(currStartDate),
        endOfWeek: endOfWeek(currStartDate)
      })
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        this.setState({
          shifts: jsonResponse.shifts,
          currentDate: currStartDate,
          weekString: weekStringg
        });
      });
  }
  render() {
    const hours = [
      "12:00am",
      "12:30am",
      "1:00am",
      "1:30am",
      "2:00am",
      "2:30am",
      "3:00am",
      "3:30am",
      "4:00am",
      "4:30am",
      "5:00am",
      "5:30am",
      "6:00am",
      "6:30am",
      "7:00am",
      "7:30am",
      "8:00am",
      "8:30am",
      "9:00am",
      "9:30am",
      "10:00am",
      "10:30am",
      "11:00am",
      "11:30am",
      "12:00pm",
      "12:30pm",
      "1:00pm",
      "1:30pm",
      "2:00pm",
      "2:30pm",
      "3:00pm",
      "3:30pm",
      "4:00pm",
      "4:30pm",
      "5:00pm",
      "5:30pm",
      "6:00pm",
      "6:30pm",
      "7:00pm",
      "7:30pm",
      "8:00pm",
      "8:30pm",
      "9:00pm",
      "9:30pm",
      "10:00pm",
      "10:30pm",
      "11:00pm",
      "11:30pm"
    ];

    /* Displays the wkdays header.
     */
    var wkdays = [];
    for (var i = 0; i < 7; i += 1) {
      wkdays.push(
        <div class="item-wday1">
          {format(addDays(startOfWeek(this.state.currentDate), i), "dd MM/DD")}
        </div>
      );
    }

    /* Maps shift ids to their collective starttimes, endtimes, and locations
     */

    var shiftGrouper = {};
    for (var i = 0; i < 300; i += 1) {
      if (this.state.shifts[i] != null && this.state.shifts[i].id != null) {
        if (this.state.shifts[i].id in shiftGrouper) {
          shiftGrouper[this.state.shifts[i].id][1] += 1;
        } else {
          shiftGrouper[this.state.shifts[i].id] = [
            this.state.shifts[i].start,
            this.state.shifts[i].end,
            this.state.shifts[i].location
          ];
        }
      }
    }

    /*Every 8th element should be an "item-hours1" header,
      while every 1-7th element should be a shift cell.
      The valid prop tracks if the Timeslot is a clickable, colored cell belonging to a shift or not.
    */
    var timeslots = [];
    for (var i = 0, ti = 0; i < 384; i += 1) {
      if (i % 8 === 0) {
        timeslots.push(<div class="item-hours">{hours[i / 8]}</div>);
      } else {
        if (
          this.state.shifts[ti].sleid === this.props.userId ||
          !(this.state.shifts[ti].id in shiftGrouper)
        ) {
          timeslots.push(
            <Timeslot
              color={"this.state.shifts[ti].color"}
              id={this.state.shifts[ti].id}
              userid={this.props.userId}
              valid={false}
            />
          );
        } else {
          timeslots.push(
            <Timeslot
              color={this.state.shifts[ti].color}
              id={this.state.shifts[ti].id}
              userid={this.props.userId}
              valid={true}
              start={shiftGrouper[this.state.shifts[ti].id][0]}
              end={shiftGrouper[this.state.shifts[ti].id][1]}
              location={shiftGrouper[this.state.shifts[ti].id][2]}
            />
          );
        }
        ti += 1;
      }
    }

    return (
      <div id="overall-container1">
        {this.state.redirect}
        <div id="schedule-container-st1">
          <div id="frontWords1">
            <button className="buttonLeftArrow">
              <img
                className="leftArrow"
                src={leftArrow}
                onClick={this.previousWeek}
                alt="leftArrow"
              />
            </button>
            <h1 id="weekString1">{this.state.weekString}</h1>
            <button className="buttonRightArrow">
              <img
                className="rightArrow"
                src={rightArrow}
                onClick={this.nextWeek}
                alt="rightArrow"
              />
            </button>
          </div>
          <div id="inner-schedule1">
            <div></div>
            {wkdays}
            {timeslots}
          </div>
        </div>
      </div>
    );
  }
}
