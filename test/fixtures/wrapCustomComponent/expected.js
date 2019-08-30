//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

class List extends Component {
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

const App = props => {
    return (
        <ServerErrorBoundary isCatchReactError>
            {
                <div>
                    <ServerErrorBoundary isCatchReactError>
                        <List />
                    </ServerErrorBoundary>
                    <ServerErrorBoundary isCatchReactError>
                        <Button />
                    </ServerErrorBoundary>
                </div>
            }
        </ServerErrorBoundary>
    );
};

export default App;
