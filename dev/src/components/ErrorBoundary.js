import React, { Component } from 'react';

class ErrorHandler extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        console.log(error);
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log('ErrorHandler', error, info);
    }

    render() {
        return this.state.hasError ? (
            <h1>Client Error Info: Something went wrong!</h1>
        ) : (
            this.props.children
        );
    }
}

export default ErrorHandler;
