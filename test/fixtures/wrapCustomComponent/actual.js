import React, { Component } from "react";

class List extends Component {
  renderList() {
    const list = [1, 2, 3];
    return list.map(x => <span>{x}</span>);
  }

  render() {
    return (
      <div>
        <h1>hello world</h1>
        {this.renderList()}
      </div>
    );
  }
}

export const Button = content => {
  return (
    <button>content</button>
  );
};

const App = props => {
  return (
    <div>
      <List />
      <Button />
    </div>
  );
};

export default App;
