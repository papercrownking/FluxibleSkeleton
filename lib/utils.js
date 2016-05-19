import debugLib from 'debug';
const debug = debugLib('fluxiblebase');

module.exports = {

	getEnvName() {
		let result;
		const hostname = 'PRODUCTION HOST HERE' || 'localhost';

		const knownEnvs = ['development',
			'test',
			'staging',
			'performance',
			'production',
			'localhost'
		];

		debug(`[server.js] resolving environment for instance hostname: ${hostname}`);

		knownEnvs.forEach((envi) => {
			if (hostname.indexOf(envi) >= 0) {
				debug(`[server.js] resolved environment: ${envi}`);
				result = envi;
			}
		});

		return result || 'development';
	}
};
