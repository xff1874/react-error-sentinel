import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function serverMarkup(context) {
    const element = context.props.children;

    try {
        const staticMarkup = renderToStaticMarkup(element);
        return (
            <div
                dangerouslySetInnerHTML={{
                    __html: staticMarkup,
                }}
            />
        );
    } catch (e) {
        return <div>loading</div>;
    }
}
export function is_server() {
    return !(typeof window !== 'undefined' && window.document);
}

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
        if (is_server()) {
            return serverMarkup(this);
        }

        if (this.state.hasError) {
            return <div>loading</div>;
        }

        return this.props.children;
    }
}
export default ErrorBoundary;
