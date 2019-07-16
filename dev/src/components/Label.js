import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
import React, { Component } from 'react';

export default class Label extends Component {
    handleClick() {
        console.log('lable clicked');
    }

    render() {
        return (
            <MyErrorHandleComponent fallback={this.fallback}>
                {<div onClick={this.handleClick}>label</div>}
            </MyErrorHandleComponent>
        );
    }
}
