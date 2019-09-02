//isCatchReactError
import ServerErrorBoundary from '$components/ServerErrorBoundary';
import React from 'react';

const Button = props => {
    return <button>{props.content}</button>;
};

export default Button;
