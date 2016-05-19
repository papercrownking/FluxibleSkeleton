/* global define, it, describe, beforeEach, afterEach */
import { expect } from 'chai';
import ApplicationStore from 'stores/ApplicationStore';

describe('ApplicationStore', () => {
	let applicationStore;
	let emptyStore;

	const context = {
		dispatch: () => {}
	};

	const applicationStoreInitData = {
		pageTitle: 'Skeleton'
	};

	beforeEach(() => {
		applicationStore = new ApplicationStore(context);

		applicationStore.pageTitle = applicationStoreInitData.pageTitle;

		emptyStore = new ApplicationStore(context);
	});

	afterEach(() => {
		applicationStore = null;
		emptyStore = null;
	});

	describe('getPageTitle function', () => {
		it('should return an empty string on store init', () => {
			const expectedString = '';
			expect(emptyStore.getPageTitle()).to.eql(expectedString);
		});

		it('should return a string if set', () => {
			expect(applicationStore.getPageTitle()).to.equal(applicationStoreInitData.pageTitle);
		});
	});

	describe('rehydrate function', () => {
		it('should set pageTitle', () => {
			const expectedString = 'AdSpecs';

			emptyStore.rehydrate({ pageTitle: expectedString });
			expect(emptyStore.pageTitle).to.eql(expectedString);
		});

		it('should set multiple attributes', () => {
			const expectedUrlString = 'Skel';

			emptyStore.rehydrate({ pageTitle: expectedUrlString });

			expect(emptyStore.pageTitle).to.eql(expectedUrlString);
		});
	});

	describe('dehydrate function', () => {
		it('should fetch the state of attributes', () => {
			const state = applicationStore.dehydrate();

			expect(state.pageTitle).to.eql(applicationStoreInitData.pageTitle);
		});
	});
});
