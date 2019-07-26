// isReactErrorSentinel
import ServerErrorBoundaryAAA from '$components/ServerErrorBoundary';
// dasdasdasd
import React, { Component } from 'react';

export default class ClientErrorContainer extends Component {
    render() {
        return (
            <ServerErrorBoundaryAAA
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div>ClientErrorContainer</div>}
            </ServerErrorBoundaryAAA>
        );
    }
}
