import React from "react";
import WithCheck from "../WithCheck";
import "./PendingSupervisor.css";

function processData(database) {
  const listItems = database.map((entry, index) => (
    <WithCheck
      desk={entry.desk}
      loc={entry.loc}
      date={entry.date}
      time={entry.time}
      needname={entry.needname}
      covername={entry.covername}
      approval={entry.approval}
    />
  ));
  return listItems;
}

class PendingSupervisor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [{}]
    };
  }
  componentDidMount() {
    fetch("/pendingsupervisor", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(jsonResponse => {
        this.setState({
          items: jsonResponse.items
        });
        console.log(this.state.items);
      });
  }

  render() {
    return (
      <div>
        <div className="middleWords">
          <h2 className="msame11">Time and Location</h2>
          <h2 className="msame0">Needing Coverage</h2>
          <h2 className="msame08">Covered By</h2>
          <h2 className="msame22"></h2>
        </div>
        <div className="pendingShifts"></div>
        {processData(this.state.items)}
        <div class="Supervisor"></div>
      </div>
    );
  }
}

export default PendingSupervisor;
