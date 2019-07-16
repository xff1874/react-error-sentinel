import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
/* eslint-disable */

import React, { Component } from 'react';
import ClientError from './ErrorComponet';

class ClientErrorContainer extends Component {
    fallback() {
        return <h1>自定义客户端报错信息</h1>;
    }

    render() {
        return (
            <MyErrorHandleComponent fallback={this.fallback}>
                {
                    <div>
                        <ClientError />
                    </div>
                }
            </MyErrorHandleComponent>
        );
    }
}

class Box extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log('click box');
    }

    render() {
        return (
            <MyErrorHandleComponent fallback={this.fallback}>
                {
                    <div>
                        <h1 onClick={this.handleClick}>BOX</h1>
                        <ClientErrorContainer />
                    </div>
                }
            </MyErrorHandleComponent>
        );
    }
}

export default Box;
