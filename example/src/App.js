// isCatchReactError
import ErrorBoundary from '$components/ErrorBoundary';
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    return (
        <ErrorBoundary isCatchReactError>
            {
                <div className="App">
                    <header className="App-header">
                        <ErrorBoundary isReactErrorSentinel>
                            <Test />
                        </ErrorBoundary>
                        <ErrorBoundary isReactErrorSentinel />
                    </header>
                </div>
            }
        </ErrorBoundary>
    );
}

const Test = () => {
    return (
        <ErrorBoundary isReactErrorSentinel>
            {<button>asdasd</button>}
        </ErrorBoundary>
    );
};

export default App;
