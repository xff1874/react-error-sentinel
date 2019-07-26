import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor() {
        super();
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(err) {
        return {
            hasError: true,
        };
    }

    componentDidCatch(err, info) {
        console.log(err, info);
    }

    render() {
        if (this.state.hasError) {
            return <div>loading</div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
