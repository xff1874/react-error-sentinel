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
        return init
            .copyErrorComponent(inputs)
            .then(() => {
                const readTempComponent = () => fs.readJSON(
                    `${tempFolder}/${inputs.mode}/ErrorBoundary.js`
                );
                const readpastedComponent = () => fs.readJSON(
                    `${process.cwd()}/${
                        inputs.componentFolder
                    }/ErrorBoundary.js`
                );

                return Promise.all([readTempComponent(), readpastedComponent()])
                    .then(() => {
                        fs.remove(
                            `${process.cwd()}/${
                                inputs.componentFolder
                            }/ErrorBoundary.js`
                        );
                    })
                    .catch(e => {
                        console.log('eeeee');
                    });
            })
            .catch(e => expect(e).toMatch('error'));
    });
});
