// isReactErrorSentinel
import ServerErrorBoundaryAAA from '$components/ServerErrorBoundary';
import React, { Component } from 'react';

export default class Label extends Component {
    handleClick() {
        console.log('lable clicked');
    }

    render() {
        return (
            <ServerErrorBoundaryAAA
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div onClick={this.handleClick}>label</div>}
            </ServerErrorBoundaryAAA>
        );
    }
}
