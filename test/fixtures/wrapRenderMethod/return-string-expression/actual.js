import React, { Component } from "react";
const TEXT = "SOME THING";

class App extends Component {
  render() {
    return (
      `HI, ${TEXT}`
    );
  }
}

export class Label extends Component {
  render() {
    return (
      <label>some thing</label>
    );
  }
}
export default App;
