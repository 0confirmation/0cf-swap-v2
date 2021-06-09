export const setupFetchStub = (data: any) => {
	return function fetchStub(_url: any) {
		return new Promise((resolve: any) => {
			resolve({
				json: () =>
					Promise.resolve({
						data,
					}),
			});
		});
	};
};
