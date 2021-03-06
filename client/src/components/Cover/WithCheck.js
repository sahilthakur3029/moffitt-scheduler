import React from "react";
import "./WithCheck.css";
import checkNofill from "./Images/check_nofill.svg";
import denyNofill from "./Images/deny_nofill.svg";

class WithCheck extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="shift">
        <div className="time_loc">
          <div className="firstrow">
            <div className="bold_desk">
              <p className="desk">{this.props.desk}</p>
            </div>
            <div className="colorful_box">
              <p className="loc">{this.props.loc}</p>
            </div>
          </div>
          <p className="date">{this.props.date}</p>
          <p className="time">{this.props.time}</p>
        </div>
        <div className="need_cov">
          <p className="needname">{this.props.needname}</p>
        </div>
        <div className="covering">
          <p className="covername">{this.props.covername}</p>
        </div>
        <div className="approval">
          <button
            className="checkbutton"
            onClick={() => this.approvalClick(this.props.requestId)}
          >
            <img className="check_nofill" src={checkNofill} alt="check" />
          </button>
          <button
            className="denybutton"
            onClick={() => this.denialClick(this.props.requestId)}
          >
            <img className="deny_nofill" src={denyNofill} alt="deny" />
          </button>
        </div>
      </div>
    );
  }

  approvalClick(reqID) {
    fetch("/api/pendingsupervisor", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ approve: true, requestID: reqID })
    })
      .then(response => {
        this.props.fixState(reqID);
        return response.json();
      })
      .then(jsonResponse => {
        console.log(jsonResponse);
      });
  }

  denialClick(reqID) {
    console.log("In click function");
    fetch("/api/pendingsupervisor", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ approve: false, requestID: reqID })
    })
      .then(response => {
        this.props.fixState(reqID);
        return response.json();
      })
      .then(jsonResponse => {
        console.log(jsonResponse);
      });
  }
}
export default WithCheck;
