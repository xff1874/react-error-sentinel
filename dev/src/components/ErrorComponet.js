import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
import React, { Component } from 'react';

export default class ErrorComponet extends Component {
    render() {
        return (
            <MyErrorHandleComponent fallback={this.fallback}>
                {<div>ErrorComponet</div>}
            </MyErrorHandleComponent>
        );
    }

    componentDidMount() {
        let a = [][0].a;
    }
}
