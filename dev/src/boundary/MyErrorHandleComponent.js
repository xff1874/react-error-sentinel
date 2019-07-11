import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function serverMarkup(context) {
    const element = context.props.children;

    try {
        const staticMarkup = renderToStaticMarkup(element);
        return <div dangerouslySetInnerHTML={{ __html: staticMarkup }} />;
    } catch (e) {
        console.log('服务端报错,catch');
        // return context.props.fallback(e);
        return '服务端报错';
    }
}

export function is_server() {
    return !(typeof window !== 'undefined' && window.document);
}

const serverRender = is_server() && serverMarkup;

class ErrorBoundary extends Component {
    constructor() {
        super();
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(err) {
        return { hasError: true };
    }

    componentDidCatch(err, info) {
        console.log(err, info);
    }

    render() {
        if (serverRender) {
            // console.log('123123')
            return serverRender(this);
        }

        if (this.state.hasError) {
            // return this.props.fallback();
            return '客户端报错';
        }

        return this.props.children;
    }
}

ErrorBoundary.defaultProps = {
    fallback: () => <h1>请联系客服</h1>,
};

export default ErrorBoundary;
