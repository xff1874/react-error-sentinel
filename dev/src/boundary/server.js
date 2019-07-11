import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function serverRender(context) {
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

export default serverRender;
