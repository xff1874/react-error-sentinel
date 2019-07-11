import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
/* eslint-disable */

import React, { Component } from 'react';
import ClientError from './ErrorComponet';

class ClientErrorContainer extends Component {
    render() {
        return (
            <MyErrorHandleComponent>
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
            <MyErrorHandleComponent>
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
