// isReactErrorSentinel
import MyErrorHandleComponentBBBBBBBB from '$component/MyErrorHandleComponentBBBBBBBB';
import React, { Component } from 'react';

export default class Label extends Component {
    handleClick() {
        console.log('lable clicked');
    }

    render() {
        return (
            <MyErrorHandleComponentBBBBBBBB
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<div onClick={this.handleClick}>label</div>}
            </MyErrorHandleComponentBBBBBBBB>
        );
    }
}
