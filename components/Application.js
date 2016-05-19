import React from 'react';
import Header from './Header/HeaderContainer';
import Footer from './Footer/Footer';
import ApplicationStore from '../stores/ApplicationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';


class Application extends React.Component {
	render() {
		const Handler = this.props.currentRoute.handler;

		return (
			<div id="ApplicationContainer">
				<div id="main" role="main" className="clearfix">
					<Handler />
				</div>
			</div>
		);
	}
}

Application.propTypes = {
	currentRoute: React.PropTypes.object,
	apiUrl: React.PropTypes.any
};

export default provideContext(handleHistory(connectToStores(
	Application, [ApplicationStore],
	(context) => {
		const appStore = context.getStore(ApplicationStore);
		return {
			pageTitle: appStore.getPageTitle()
		};
	}
)));
