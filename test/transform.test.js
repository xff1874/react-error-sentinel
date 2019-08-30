/* eslint-disable no-undef */
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const transform = require('../src/command/transform');

const { join } = path;
const { readFileSync } = fs;

describe('transform React Components', () => {
    const fixturesDir = join(__dirname, 'fixtures');

    test('wrap render method with ErrorBoundary', () => {
        const fixtureDir = join(fixturesDir, 'wrapRenderMethod');
        const creConfig = join(fixtureDir, '.catch-react-error-config.json');
        const actualFile = join(fixtureDir, 'actual.js');
        const expectedFile = join(fixtureDir, 'expected.js');

        return fsExtra
            .copy(creConfig, `${process.cwd()}/.catch-react-error-config.json`)
            .then(transform)
            .then(() => {
                const actual = readFileSync(actualFile, 'utf-8');
                const expected = readFileSync(expectedFile, 'utf-8');
                expect(actual.trim()).toEqual(expected.trim());
            });
    });

    test('wrap custom component with ErrorBoundary', () => {
        const fixtureDir = join(fixturesDir, 'wrapCustomComponent');
        const creConfig = join(fixtureDir, '.catch-react-error-config.json');
        const actualFile = join(fixtureDir, 'actual.js');
        const expectedFile = join(fixtureDir, 'expected.js');

        return fsExtra
            .copy(creConfig, `${process.cwd()}/.catch-react-error-config.json`)
            .then(transform)
            .then(() => {
                const actual = readFileSync(actualFile, 'utf-8');
                const expected = readFileSync(expectedFile, 'utf-8');
                expect(actual.trim()).toEqual(expected.trim());
            });
    });
});
