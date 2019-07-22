// isReactErrorSentinel
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

export default class Hello extends Component {
    render() {
        return (
            <ServerErrorBoundary isReactErrorSentinel fallback={this.fallback}>
                {<div>dasdasd</div>}
            </ServerErrorBoundary>
        );
    }
}
