/* eslint-disable */
import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
import React, { Component } from 'react';

class ServerSideErrorComponent extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log('btn clicked');
    }

    fallback() {
        return <h1>自定义服务端报错错误信息</h1>;
    }

    render() {
        const { btnLabel } = this.props;
        return (
            <MyErrorHandleComponent fallback={this.fallback}>
                {<Button btnLabel={btnLabel} />}
            </MyErrorHandleComponent>
        );
    }
}

class Button extends Component {
    render() {
        const { btnLabel } = this.props;
        const arr = [];
        console.log(arr[0].a);
        return (
            <MyErrorHandleComponent fallback={this.fallback}>
                {<button> {btnLabel}</button>}
            </MyErrorHandleComponent>
        );
    }
}

export default ServerSideErrorComponent;
