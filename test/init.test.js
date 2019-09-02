/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs-extra');
const fsNode = require('fs');

const init = require('../src/command/init');

const tempFolder = path.resolve(__dirname, 'src/templates');

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

    test('rewrite template config', () => {
        const testObj = {
            sentinel: {
                imports:
                    'import ServerErrorBoundary from \'$components/ServerErrorBoundary\'',
                errorHandleComponent: 'ServerErrorBoundary',
                filter: ['/src/ig'],
            },
            wrapAllCustomComponent: true,
            mode: 'csr',
            sourceDir: 'src',
        };
        const TEST_JSON = JSON.stringify(testObj);

        return init.writeCRErc({ inputs: '', resrcObj: TEST_JSON }).then(() => {
            fs.readJSON(`${process.cwd()}/.catch-react-error-config.json`)
                .then(json => {
                    expect(json).toEqual(TEST_JSON);
                })
                .then(() => {
                    fs.remove(
                        `${process.cwd()}/.catch-react-error-config.json`
                    );
                });
        });
    });

    test('copy template boundary component', () => {
        const inputs = {
            mode: 'SSR',
            componentFolder: 'test_dir',
        };
        return init.copyErrorComponent(inputs).catch(e => {
            console.log(e);
            expect(e).toBeInstanceOf(Error);
        });
    });
});

afterAll(() => {
    fs.removeSync(`${process.cwd()}/.catch-react-error-config.json`);
    fs.removeSync(`${process.cwd()}/test_dir`);
});
