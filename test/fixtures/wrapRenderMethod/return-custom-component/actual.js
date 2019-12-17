import React, { Component } from "react";

class App extends Component {
  renderList() {
    const list = [1, 2, 3];
    return list.map(x => <span>{x}</span>);
  }

  render() {
    return (
      <Button />
    );
  }
}

export const Button = content => {
  return (
    <button>content</button>
  );
};
export default App;
