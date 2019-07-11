import MyErrorHandleComponent from '$component/MyErrorHandleComponent';
import React, { Component } from 'react';

class Label extends Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log('label clicked');
    }

    render() {
        const { label = 'default label' } = this.props;
        return (
            <MyErrorHandleComponent>
                {<label onClick={this.handleClick}>{label}</label>}
            </MyErrorHandleComponent>
        );
    }
}

export default Label;
