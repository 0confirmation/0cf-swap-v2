import { getNetwork, getNetworkId, getNetworkNameFromId } from '../network';
import { NETWORK_LIST, NETWORK_IDS } from '../../config/constants/network';
import { EthNetwork, BscNetwork } from '../../config/models/network';

describe('getNetworkId', () => {
	test.each([
		[NETWORK_LIST.ETH, NETWORK_IDS.ETH],
		[NETWORK_LIST.BSC, NETWORK_IDS.BSC],
		[undefined, undefined],
	])('getNetworkId(%s) returns %i', (network, expected) => {
		expect(getNetworkId(network)).toBe(expected);
	});
});

describe('getNetworkNameFromId', () => {
	test.each([
		[NETWORK_IDS.ETH, new EthNetwork().name],
		[NETWORK_IDS.BSC, new BscNetwork().name],
		[NETWORK_IDS.FTM, null],
		[999, null],
	])('getNetworkNameFromId(%i) returns %s', (networkId, expected) => {
		expect(getNetworkNameFromId(networkId)).toBe(expected);
	});
});

describe('getNetwork', () => {
	test.each([
		[NETWORK_LIST.ETH, EthNetwork],
		[NETWORK_LIST.BSC, BscNetwork],
		[undefined, EthNetwork],
	])('getNetwork(%s) returns %s', (network, expected) => {
		expect(getNetwork(network)).toBeInstanceOf(expected);
	});
});
