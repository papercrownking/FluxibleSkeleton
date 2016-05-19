import utils from './utils';
import debugLib from 'debug';

const debug = debugLib('fluxiblebase');

function createHash(hash) {
	const text = [];
	let itor;
	const encode = encodeURIComponent;

	for (itor in hash) {
		/* istanbul ignore else */
		if (hash.hasOwnProperty(itor)) {
			text.push(`${encode(itor)}=${encode(String(hash[itor]))}`);
		}
	}
	return text.join('&');
}

function getFullUrl(url, params) {
	let fullUrl = typeof url === 'string' && url.length > 0 ? url : '';
	let append = params;
	let connector = '?';
	const lastIndex = fullUrl.length - 1;
	if (lastIndex > 0) {
		if (fullUrl.indexOf('?') === lastIndex) {
			connector = '';
		} else if (fullUrl.indexOf('?') > -1) {
			connector = '&';
		}
	}

	if (Object.prototype.toString.call(append) === '[object Array]') {
		append = append.join('&');
	} else if (typeof append === 'object' || typeof append === 'function') {
		append = createHash(append);
	}
	if (typeof append === 'string' && append.length > 0) {
		if (append.indexOf('?') === 0) {
			append = append.slice(1, append.length);
		}
		fullUrl += connector + append;
	}
	return fullUrl;
}


module.exports = {

	requireHTTPS(req, res, next) {
		const secret = '1';
		let redirectedAlready = false;
		let ypathString = '';
		let ypath = [];
		let proto = 'http';

		if (req.query.hasOwnProperty('rnd')) {
			const decrypt = req.query.rnd || '';
			if (typeof decrypt === 'string' && decrypt === secret) {
				debug('[ server.js ] - redirectedAlready is set to true. decrypt is: ', decrypt);
				redirectedAlready = true;
			} else {
				debug('[ server.js ] - decrypt did not match SSL REDIRECTED: ', decrypt);
			}
		} else {
			debug('[ server.js ] - rnd is not set in the req.query', req.query);
		}

		if (req.header) {
			ypathString = req.headers['y-path'] || req.headers['Y-path'] || '';
			debug('[ server.js ] - ypathString : ', ypathString);

			const via = req.headers && req.headers.via;
			if (typeof via === 'string' && via.indexOf('HTTPS') === 0) {
				proto = 'https';
			}
		}

		if (utils.getEnvName() !== 'development' && utils.getEnvName() !== 'localhost') {
			if (proto === 'http' && redirectedAlready === false) {
				const redirectURL = getFullUrl(`https://${req.get('host')}${req.path}`, `rnd=${secret}`);
				debug('[ server.js ] - redirecting to ', redirectURL);
				return res.redirect(redirectURL);
			}
		}

		return next();
	}
};
