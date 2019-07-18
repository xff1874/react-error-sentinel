// isReactErrorSentinel
import MyErrorHandleComponentBBBBBBBB from '$component/MyErrorHandleComponentBBBBBBBB';
// dasdasdasd
import React, { Component } from 'react';

export default class ClientErrorContainer extends Component {
    render() {
        return (
            <MyErrorHandleComponentBBBBBBBB
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div>ClientErrorContainer</div>}
            </MyErrorHandleComponentBBBBBBBB>
        );
    }
}
