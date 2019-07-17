import MyErrorHandleComponentBBBBBBBBXXSpecialFlagXX from '$component/MyErrorHandleComponentBBBBBBBB';
import React, { Component } from 'react';

export default class ClientErrorContainer extends Component {
    render() {
        return (
            <MyErrorHandleComponentBBBBBBBBXXSpecialFlagXX
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div>ClientErrorContainer</div>}
            </MyErrorHandleComponentBBBBBBBBXXSpecialFlagXX>
        );
    }
}
