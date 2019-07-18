// isReactErrorSentinel
import MyErrorHandleComponentBBBBBBBB from '$component/MyErrorHandleComponentBBBBBBBB';

/* eslint-disable */
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
            <MyErrorHandleComponentBBBBBBBB
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<Button btnLabel={btnLabel} />}
            </MyErrorHandleComponentBBBBBBBB>
        );
    }
}

class Button extends Component {
    render() {
        const { btnLabel } = this.props;
        const arr = [];
        console.log(arr[0].a);
        return (
            <MyErrorHandleComponentBBBBBBBB
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<button> {btnLabel}</button>}
            </MyErrorHandleComponentBBBBBBBB>
        );
    }
}

export default ServerSideErrorComponent;
