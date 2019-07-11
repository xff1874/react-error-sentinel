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

    render() {
        const { btnLabel } = this.props;
        const arr = [];
        console.log(arr[0].a);
        return (
            <MyErrorHandleComponent>
                <button onClick={this.handleClick}>{btnLabel}</button>
            </MyErrorHandleComponent>
        );
    }
}

const Safe = props => {
    return (
        <MyErrorHandleComponent>
            <ServerSideErrorComponent {...props} />
        </MyErrorHandleComponent>
    );
};

// class ServerError extends Component {
//     render() {
//         return (
//             <MyErrorHandleComponent>
//                 {<h1>{props.btnLabel}</h1>}
//             </MyErrorHandleComponent>
//         );
//     }
// }

export default Safe;
