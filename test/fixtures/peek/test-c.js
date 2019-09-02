import React, { PureComponent } from 'react';

class Button extends PureComponent {
    render() {
        return <button>{this.props.content}</button>;
    }
}

export default Button;
