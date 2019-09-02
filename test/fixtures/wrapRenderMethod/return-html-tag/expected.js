//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

class App extends Component {
    render() {
        return (
            <ServerErrorBoundary isCatchReactError>
                {<h1>hello world</h1>}
            </ServerErrorBoundary>
        );
    }
}

export default App;
