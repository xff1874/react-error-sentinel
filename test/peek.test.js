/* eslint-disable no-undef */
const path = require('path');
const fsExtra = require('fs-extra');

const peek = require('../src/command/peek');

const { join } = path;

const fixturesDir = join(__dirname, 'fixtures');

describe('peek all transformed file list', () => {
    const fixtureDir = join(fixturesDir, 'peek');
    const creConfig = join(fixtureDir, '.catch-react-error-config.json');

    const expectedList = [
        '/test/fixtures/peek/test-a.js',
        '/test/fixtures/peek/test-b.js',
    ];

    test('peek transformed file list', () => fsExtra
        .copy(creConfig, `${process.cwd()}/.catch-react-error-config.json`)
        .then(peek)
        .then(fileList => {
            expect(fileList).toEqual(expectedList);
        }));
});

afterAll(() => {
    fsExtra.removeSync(`${process.cwd()}/.catch-react-error-config.json`);
});
