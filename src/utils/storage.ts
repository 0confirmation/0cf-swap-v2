import { LocalStoragePersistenceAdapter } from 'zero-protocol/dist/lib/persistence/localStorage';
import { TransferRequestWithStatus } from 'zero-protocol/dist/lib/persistence/types';

interface TransferRequestWithStatusAndDate extends TransferRequestWithStatus {
	date: Date;
}

LocalStoragePersistenceAdapter.prototype.getAllTransferRequests = async (): Promise<TransferRequestWithStatus[]> => {
	const returnArr: TransferRequestWithStatusAndDate[] = [];
	const entries = Object.entries(window.localStorage).filter(([k, v]) => k.startsWith('request:'));
	for (const [, value] of entries) {
		returnArr.push(JSON.parse(value));
	}
	returnArr.sort((a, b) => {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});

	return returnArr.reverse();
};

LocalStoragePersistenceAdapter.prototype.setStatus = async (key, value): Promise<void> => {
	console.log(key, typeof key);
	const item = Object.entries(window.localStorage).find(([k, v]) => k.startsWith('request:' + key));
	console.log(item);
	const parsed = item ? JSON.parse(item[1]) : undefined;
	parsed.status = value;
	const unparsed = JSON.stringify(parsed);
	window.localStorage.setItem(`request:${key}`, unparsed);
	return;
};

export const storage = new LocalStoragePersistenceAdapter();
