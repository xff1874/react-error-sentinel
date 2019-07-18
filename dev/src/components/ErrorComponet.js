// isReactErrorSentinel
import MyErrorHandleComponentBBBBBBBB from '$component/MyErrorHandleComponentBBBBBBBB';
import React, { Component } from 'react';

export default class ErrorComponet extends Component {
    render() {
        return (
            <MyErrorHandleComponentBBBBBBBB
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div>dasdasd</div>}
            </MyErrorHandleComponentBBBBBBBB>
        );
    }
}
