//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';
const TEXT = 'SOME THING';

class App extends Component {
    render() {
        return (
            <ServerErrorBoundary
                isCatchReactError
            >{`HI, ${TEXT}`}</ServerErrorBoundary>
        );
    }
}

export class Label extends Component {
    render() {
        return (
            <ServerErrorBoundary isCatchReactError>
                {<label>some thing</label>}
            </ServerErrorBoundary>
        );
    }
}
export default App;
