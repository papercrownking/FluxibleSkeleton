import BaseStore from 'fluxible/addons/BaseStore';
import RouteStore from './RouteStore';

class ApplicationStore extends BaseStore {
	constructor(dispatcher) {
		super(dispatcher);
		this.pageTitle = '';
	}

	handlePageData(currentRoute) {
		this.dispatcher.waitFor(RouteStore, () => {
			if (currentRoute) {
				if (currentRoute.title) {
					this.pageTitle = currentRoute.title;
				}
				this.emitChange();
			}
		});
	}

	getPageTitle() {
		return this.pageTitle;
	}

	dehydrate() {
		return {
			pageTitle: this.pageTitle
		};
	}

	rehydrate(state) {
		this.pageTitle = state.pageTitle;
	}
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
	NAVIGATE_SUCCESS: 'handlePageData'
};

export default ApplicationStore;
