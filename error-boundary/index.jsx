import React, { Component } from 'react';

function is_server() {
    return !(typeof window !== 'undefined' && window.document);
}

const serverRender = is_server() && require('./server');

class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(err) {
        return { hasError: true };
    }

    componentDidCatch(err, info) {
        console.log(err, info);
    }

    render() {
        if (serverRender) {
            serverRender(this);
        }

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
