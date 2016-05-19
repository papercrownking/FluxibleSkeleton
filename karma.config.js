const path = require('path');
var testDirectory = 'artifacts/test';

if(process.env.testDir){
    testDirectory = process.env.testDir;
}

const outputFileLocation = testDirectory+'/results.tap';

module.exports = function init(config) {
    config.set({
        browsers: ['PhantomJS'],
        singleRun: true,
        frameworks: ['mocha', 'chai'],
        files: [
            './test/vendors/sinon.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
            './test/unit/**/*.js'
        ],
        plugins: ['karma-chai', 'karma-mocha',
            'karma-sourcemap-loader', 'karma-webpack', 'karma-coverage',
            'karma-mocha-reporter', 'karma-phantomjs-launcher', 'karma-tap-reporter'
        ],
        preprocessors: {
            './test/unit/**/*.js': ['webpack', 'sourcemap']
        },
        reporters: ['mocha', 'coverage', 'tap'],
        coverageReporter: {
            dir: 'artifacts/',
            reporters: [
                { type: 'json', subdir: 'coverage' },
                { type: 'lcov', subdir: 'coverage' }
            ]
        },
        tapReporter: {
            outputFile: outputFileLocation
        },
        webpack: {
            devtool: 'inline-source-map',
            resolve: {
                root: path.resolve(__dirname, './'),
                extensions: ['', '.js', '.jsx'],
                alias: {
                    'sinon': 'sinon/pkg/sinon'
                }
            },
            module: {
                preLoaders: [{ 
                    test: /\.js$/, 
                    loader: 'isparta', 
                    exclude: /(test|node_modules)\//,
                }],
                noParse: [
                    /node_modules\/sinon\//
                ],
                loaders: [
                    { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
                ]
            },
            externals: {
                jsdom: 'window',
                cheerio: 'window',
                sinon: 'window',
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': 'window'
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
