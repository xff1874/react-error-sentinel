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
            return this.props.fallback();
        }

        return this.props.children;
    }
}

ErrorBoundary.defaultProps = {
    fallback: () => <h1>请联系客服</h1>,
};
export default ErrorBoundary;
