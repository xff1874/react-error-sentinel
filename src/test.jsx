import React, { Component } from 'react';
import Loading from './loading';

const Button = () => <button>btn</button>;

class Label extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Loading />
            </div>
        );
    }
}

let test = 'test';

const lambda = x => x;

export default Button;
