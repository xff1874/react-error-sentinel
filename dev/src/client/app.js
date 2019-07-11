import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
import React, { Component } from 'react';
import ServerSideErrorComponent from '../components/ServerSideErrorComponent';
import ClientErrorComponent from '../components/ClientErrorContainer';
import Label from '../components/Label';

export default class App extends Component {
    render() {
        return (
            <MyErrorHandleComponent>
                <ServerSideErrorComponent btnLabel="click me!" />
                <ClientErrorComponent />
                <Label />
            </MyErrorHandleComponent>
        );
    }
}
