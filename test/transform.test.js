/* eslint-disable no-undef */
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');

const transform = require('../src/command/transform');
const prettier = require('prettier');

const { join } = path;
const { readFileSync, readdirSync } = fs;

const fixturesDir = join(__dirname, 'fixtures');

const prettierFormatCode = content => prettier.format(content, { parser: 'babel' });

describe('transform component: wrap render method with ErrorBoundary', () => {
    const fixtureDir = join(fixturesDir, 'wrapRenderMethod');
    let fixtures = readdirSync(fixtureDir);

    const returnFixtures = fixtures.filter(
        fixture => fixture.indexOf('return-') > -1
    );

    if (returnFixtures.length) {
        fixtures = returnFixtures;
    }
    beforeAll(() => {
        const creConfig = join(fixtureDir, '.catch-react-error-config.json');
        fsExtra.copySync(
            creConfig,
            `${process.cwd()}/.catch-react-error-config.json`
        );
        transform();
    });

    fixtures.map(folderItem => {
        test('wrap render method with ErrorBoundary', () => {
            const actualFile = join(fixtureDir, folderItem, 'actual.js');
            const expectedFile = join(fixtureDir, folderItem, 'expected.js');

            const actual = readFileSync(actualFile, 'utf-8');
            const expected = readFileSync(expectedFile, 'utf-8');
            expect(prettierFormatCode(actual.trim())).toEqual(
                prettierFormatCode(expected.trim())
            );
        });
    });
});

describe('transform component: wrap custom component with ErrorBoundary', () => {
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
                expect(prettierFormatCode(actual.trim())).toEqual(
                    prettierFormatCode(expected.trim())
                );
            });
    });
});

afterAll(() => {
    fsExtra.removeSync(`${process.cwd()}/.catch-react-error-config.json`);
});
