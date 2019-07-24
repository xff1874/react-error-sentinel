// isReactErrorSentinel
import ServerErrorBoundaryAAA from '$components/ServerErrorBoundary';

/* eslint-disable */
import React, { Component } from 'react';

class ServerSideErrorComponent extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
        this.renderItems = this.renderItems.bind(this);
    }

    handleClick() {
        console.log('btn clicked');
    }

    fallback() {
        return <h1>自定义服务端报错错误信息</h1>;
    }

    renderItems() {
        return [1, 2, 3].map(item => <h1>{item}</h1>);
    }

    renderTest() {
        return <h1>renderTest</h1>;
    }

    render() {
        const { btnLabel } = this.props;
        return (
            <ServerErrorBoundaryAAA
                isReactErrorSentinel
                fallback={this.fallback}
            >
                {<Button btnLabel={btnLabel} />}
            </ServerErrorBoundaryAAA>
        );
    }
}

class Button extends Component {
    render() {
        const { btnLabel } = this.props;
        const arr = [];
        console.log(arr[0].a);
        return (
            <ServerErrorBoundaryAAA
                fallback={this.fallback}
                isReactErrorSentinel
            >
                {<button> {btnLabel}</button>}
            </ServerErrorBoundaryAAA>
        );
    }
}

export default ServerSideErrorComponent;
