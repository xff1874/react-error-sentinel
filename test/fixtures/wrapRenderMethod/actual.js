//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

class App extends Component {
    renderList() {
        const list = [1, 2, 3];
        return list.map(x => <span>{x}</span>);
    }

    render() {
        return (
            <ServerErrorBoundary isCatchReactError>
                {
                    <div>
                        <h1>hello world</h1>
                        {this.renderList()}
                    </div>
                }
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
