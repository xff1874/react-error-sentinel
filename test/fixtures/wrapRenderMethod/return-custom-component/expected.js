//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

class App extends Component {


    render() {
        return (
            <ServerErrorBoundary isCatchReactError>
                {<CustomComponent />}
            </ServerErrorBoundary>
        );
    }
}


export default App;
