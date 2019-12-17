import React, { Component } from "react";
const LIST = [1, 2, 3];

class App extends Component {
    render() {
        return (
            LIST.map(x => (
                <span>{x}</span>
            ))
        );
    }
}

export default App;
