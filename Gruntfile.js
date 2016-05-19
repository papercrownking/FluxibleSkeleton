const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const CHUNK_REGEX = /^([A-Za-z0-9_\-]+)\..*/;
const nodemonArgs = [];

module.exports = function(grunt) {
    grunt.initConfig({
        project: {
            build: './build',
            public: '/public'
        },
        clean: ['build'],
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: ['img/**'],
                    dest: '<%= project.build %>/'
                }]
            }
        },
        concurrent: {
            dev: ['nodemon:app', 'webpack:dev'],
            options: {
                logConcurrentOutput: true
            }
        },
        nodemon: {
            app: {
                script: './start.js',
                options: {
                    ignore: ['<%= project.build %>/**', 'node_modules'],
                    ext: 'js,jsx,md',
                    nodeArgs: nodemonArgs
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ['./assets/css'],
                    compress: true
                },
                files: {
                    'assets/css/main.css': 'assets/css/main.less'
                }
            }
        },
        cssmin: {
            dev: {
                options: {
                    report: 'gzip',
                    compatibility: 'ie8',
                    sourceMap: true
                },
                files: [{
                    src: [
                        './assets/css/**/*.css'

                    ],
                    dest: '<%= project.build %>/css/bundle.css'
                }]
            },
            prod: {
                options: {
                    report: 'gzip',
                    compatibility: 'ie8',
                    sourceMap: false
                },
                files: [{
                    src: [
                        './assets/css/**/*.css'
                    ],
                    dest: '<%= project.build %>/css/bundle.css'
                }]
            }
        },
        webpack: {
            dev: {
                resolve: {
                    extensions: ['', '.js', '.jsx']
                },
                entry: './client.js',
                output: {
                    path: '<%= project.build %>/js',
                    publicPath: '/public/js/',
                    filename: '[name].js'
                },
                module: {
                    loaders: [
                        { test: /\.css$/, loader: 'style!css' },
                        {
                            test: /\.jsx?$/, exclude: /node_modules/,
                            loader: require.resolve('babel-loader')
                        },
                        { test: /\.json$/, loader: 'json-loader' }
                    ]
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('development')
                        }
                    }),
                    new webpack.NormalModuleReplacementPlugin(
                            /^react(\/addons)?$/,
                            require.resolve('react/addons')
                        )
                ],
                stats: {
                    color: true
                },
                devtool: 'source-map',
                watch: true,
                keepalive: true
            },
            prod: {
                resolve: {
                    extensions: ['', '.js', '.jsx']
                },
                entry: './client.js',
                output: {
                    path: '<%= project.build %>/js',
                    publicPath: '<%= project.public %>js/',
                    filename: '[name].min.js',
                    chunkFilename: '[name].min.js'
                },
                module: {
                    loaders: [
                        { test: /\.(woff|eot|ttf|woff2|svg)/, loader: 'file' },
                        { test: /\.css$/, loader: 'style!css' },
                        { test: /\.less$/, loader: 'style!css!less' },
                        { test: /\.(png|jpg|gif)$/, loader: 'file' },
                        {
                            test: /\.jsx?$/, exclude: /node_modules/,
                            loader: require.resolve('babel-loader')
                        },
                        { test: /\.json$/, loader: 'json-loader' }
                    ]
                },
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            NODE_ENV: JSON.stringify('production')
                        }
                    }),
                    new webpack.NormalModuleReplacementPlugin(
                        /^react(\/addons)?$/,
                        require.resolve('react/addons')
                    ),
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    }),
                    function webpackStatsPlugin() {
                        this.plugin('done', function(stats){
                            const data = stats.toJson();
                            const assets = data.assetsByChunkName;
                            const output = {
                                assets: {},
                                cdnPath: this.options.output.publicPath
                            };
                            Object.keys(assets).forEach(function(key){
                                const value = assets[key];
                                const matches = key.match(CHUNK_REGEX);
                                if (matches) {
                                    key = matches[1];
                                }
                                output.assets[key] = value;
                            });
                            fs.writeFileSync(
                                path.join(process.cwd(), 'build', 'assets.json'),
                                JSON.stringify(output, null, 4)
                            );
                        });
                    }
                ],
                progress: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['dev']);
    grunt.registerTask('lint', ['eslint']);
    grunt.registerTask('dev', ['clean', 'copy', 'less', 'cssmin:dev', 'concurrent:dev']);
    grunt.registerTask('build', ['clean', 'copy', 'less', 'cssmin:prod', 'webpack:prod']);
};

