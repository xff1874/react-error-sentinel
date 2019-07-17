import MyErrorHandleComponentBBBBBBBBXXSpecialFlagXX from '$component/MyErrorHandleComponentBBBBBBBB';
import React, { Component } from 'react';

export default class ErrorComponet extends Component {
    render() {
        return (
            <MyErrorHandleComponentBBBBBBBBXXSpecialFlagXX
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div>dasdasd</div>}
            </MyErrorHandleComponentBBBBBBBBXXSpecialFlagXX>
        );
    }
}
