// isReactErrorSentinel
import ServerErrorBoundaryAAA from '$components/ServerErrorBoundary';
import React from 'react';
import { hydrate } from 'react-dom';
import App from './app';

hydrate(<App />, document.getElementById('root'));
