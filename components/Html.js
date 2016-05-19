import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';

class Html extends React.Component {
	render() {
		if (!this.props.markup || !this.props.state) {
			return null;
		}

		return (
			<html>
			<head>
				<title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
				<link rel="stylesheet" href="/public/css/bundle.css" />
			</head>
			<body>
				<div id="app" dangerouslySetInnerHTML={{ __html: this.props.markup }}></div>
				<script dangerouslySetInnerHTML={{ __html: this.props.state }}></script>
				<script src={`/public/js/${this.props.clientFile}`}></script>
			</body>
			</html>
		);
	}
}

Html.propTypes = {
	clientFile: React.PropTypes.string,
	markup: React.PropTypes.string,
	state: React.PropTypes.string,
	context: React.PropTypes.object
};

export default Html;
