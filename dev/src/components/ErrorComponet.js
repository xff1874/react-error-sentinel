import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
import React, { Component } from 'react';

class ClientError extends Component {
    render() {
        return (
            <MyErrorHandleComponent>
                {<h3>ClientErrorComponent</h3>}
            </MyErrorHandleComponent>
        );
    }

    componentDidMount() {
        // const Mount = null;
        // console.log(Mount.test);
    }
}

export default ClientError;
