//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

class App extends Component {


    render() {
        return (
            <ServerErrorBoundary isCatchReactError>
                {<Button />}
            </ServerErrorBoundary>
        );
    }
}

export const Button = content => {
    return (
        <ServerErrorBoundary isCatchReactError>
            {<button>content</button>}
        </ServerErrorBoundary>
    );
};
export default App;
