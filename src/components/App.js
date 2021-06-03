import React, { Component } from "react";
import "../css/App.css";

import AddAppointments from "./AddAppointments";
import SearchAppointments from "./SearchAppointments";
import ListAppointments from "./ListAppointments";
import { findIndex, without } from "lodash";

class App extends Component {
  constructor() {
    super();
    this.state = {
      formDisplay: false,
      orderBy: "petName",
      orderDir: "asc",
      queryText: "",
      myAppoints: [],
      lastIndex: 0,
    };
    this.deleteAppointments = this.deleteAppointments.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointments = this.addAppointments.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }
  addAppointments(apt) {
    let tempApts = this.state.myAppoints;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppoints: tempApts,
      lastIndex: this.state.lastIndex + 1,
    });
  }
  deleteAppointments(apt) {
    let tempApts = this.state.myAppoints;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppoints: tempApts,
    });
  }
  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay,
    });
  }
  changeOrder(field, dir) {
    this.setState({
      orderBy: field,
      orderDir: dir,
    });
  }
  searchApts(text) {
    this.setState({
      queryText: text,
    });
  }
  updateInfo(name, value, id) {
    let tempApts = this.state.myAppoints;
    let aptIndex = findIndex(this.state.myAppoints, {
      aptId: id,
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppoints: tempApts,
    });
  }

  componentDidMount() {
    fetch("./data.json")
      .then((response) => response.json())
      .then((result) => {
        const apts = result.map((item) => {
          item.aptId = this.state.lastIndex;
          this.setState({
            lastIndex: this.state.lastIndex + 1,
          });
          return item;
        });
        this.setState({
          myAppoints: apts,
        });
      });
  }

  render() {
    let order;
    let filteredApts = this.state.myAppoints;
    if (this.state.orderDir === "asc") {
      order = 1;
    } else {
      order = -1;
    }
    filteredApts = filteredApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order;
        } else {
          return 1 * order;
        }
      })
      .filter((eachItem) => {
        return (
          eachItem["petName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["ownerName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["aptNotes"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase())
        );
      });
    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointments={this.addAppointments}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointments={this.deleteAppointments}
                  updateInfo={this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
export default App;
