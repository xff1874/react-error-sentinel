// isReactErrorSentinel
import ServerErrorBoundaryAAA from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

export default class ErrorComponet extends Component {
    render() {
        return (
            <ServerErrorBoundaryAAA
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div>dasdasd</div>}
            </ServerErrorBoundaryAAA>
        );
    }
}
