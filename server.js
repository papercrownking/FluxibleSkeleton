/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import serialize from 'serialize-javascript';
import { navigateAction } from 'fluxible-router';
import debugLib from 'debug';
import React from 'react';
import ReactDOM from 'react-dom/server';
import app from './app';
import utils from './lib/utils';
import expressMiddleware from './lib/expressMiddleware';
import HtmlComponent from './components/Html';
import { createElementWithContext } from 'fluxible-addons-react';

const debug = debugLib('fluxiblebase');

const env = process.env.NODE_ENV;

const server = express();
server.use('/public', express.static(path.join(__dirname, '/build')));
server.use(compression());
server.use(bodyParser.json());

const fetchrPlugin = app.getPlugin('FetchrPlugin');

fetchrPlugin.registerService(require('./services/apiData'));

server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());

server.use(expressMiddleware.requireHTTPS);

server.use((req, res, next) => {
    const context = app.createContext();

    debug('Executing navigate action');
    context.getActionContext().executeAction(navigateAction, {
        url: req.url
    }, (err) => {
        if (err) {
            if (err.statusCode && err.statusCode === 404) {
                // Pass through to next middleware
                next();
            } else {
                next(err);
            }
            return;
        }

        debug('Exposing context state');
        const exposed = `window.App=${serialize(app.dehydrate(context))};`;

        debug('Rendering Application component into html');
        const markup = ReactDOM.renderToString(createElementWithContext(context));
        const htmlElement = React.createElement(HtmlComponent, {
            clientFile: env === 'production' ? 'main.min.js' : 'main.js',
            context: context.getComponentContext(),
            state: exposed,
            markup
        });
        const html = ReactDOM.renderToStaticMarkup(htmlElement);

        debug('Sending markup');
        res.type('html');
        res.write(`<!DOCTYPE html>${html}`);
        res.end();
    });
});


/* For local tests, we check against environemtn to be 'localhost' - which is automagically set
since we're not in manhattan_context */
if (utils.getEnvName() === 'localhost') {
    const port = process.env.PORT || 3000;
    server.listen(port);
    debug(`[server.js] Application listening on port ${port}`);
}

export default server;
