// isReactErrorSentinel
import ServerErrorBoundaryAAA from '$components/ServerErrorBoundary';
import React, { Component, Fragment } from 'react';
import ServerSideErrorComponent from '../components/ServerSideErrorComponent';
import ClientErrorComponent from '../components/ClientErrorContainer';
import Label from '../components/Label';

export default class App extends Component {
    render() {
        return (
            <ServerErrorBoundaryAAA isReactErrorSentinel>
                {
                    <Fragment>
                        <ServerSideErrorComponent btnLabel="click me!" />
                        <ClientErrorComponent />
                        <Label />
                    </Fragment>
                }
            </ServerErrorBoundaryAAA>
        );
    }
}
