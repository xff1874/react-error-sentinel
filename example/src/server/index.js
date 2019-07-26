// isReactErrorSentinel
import ServerErrorBoundaryAAA from '$components/ServerErrorBoundary';
import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import App from './app';

const app = express();
app.use(express.static('dev/build'));
app.get('/', (req, res) => {
    const htmlMarkUp = renderToString(<App />);
    res.send(`
        <!DOCTYPE html>
            <html>
                <head>
                    <script src='/dll/vendor.dll.js' defer></script>
                    <script src='/client.js' defer></script>
                </head>
                <body>
                    <div id='root'>${htmlMarkUp}</div>
                </body>
            </html>
    `);
});
const port = 3232;
app.listen(port, () => console.log(`react-server-render listening on port ${port}`));
