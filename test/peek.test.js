/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs-extra');

const init = require('../src/command/init');

const tempFolder = path.resolve(__dirname, '../templates');

describe('read and rewrite CRE templates', () => {
    const input = {
        mode: 'SSR',
        sourceDir: 'root/src',
    };

    test('read template config', () => init
        .readTempCRErc(input)
        .then(({ resrcObj, inputs }) => {
            expect(resrcObj.mode).toBe('SSR');
            expect(resrcObj.sourceDir).toBe('root/src');
            expect(inputs).toEqual(input);
        })
        .catch(e => expect(e).toMatch('error')));
});
