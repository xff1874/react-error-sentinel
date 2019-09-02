//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';
const LIST = [1, 2, 3];

class App extends Component {
    render() {
        return (
            <ServerErrorBoundary isCatchReactError>
                {LIST.map(x => (
                    <span>{x}</span>
                ))}
            </ServerErrorBoundary>
        );
    }
}

export default App;
