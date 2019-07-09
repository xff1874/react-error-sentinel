import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function serverRender(context) {
    const element = context.props.children;

    try {
        const staticMarkup = renderToStaticMarkup(element);
        return <div dangerouslySetInnerHTML={{ __html: staticMarkup }} />;
    } catch (e) {
        return context.props.fallBack(e);
    }
}

export default serverRender;
