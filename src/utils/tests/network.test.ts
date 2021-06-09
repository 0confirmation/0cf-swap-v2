import { getNetwork, getNetworkId, getNetworkNameFromId } from '../network';
import { NETWORK_LIST, NETWORK_IDS } from '../../config/constants/network';
import { EthNetwork, BscNetwork } from '../../config/models/network';

describe('getNetworkId', () => {
	test.each([
		[NETWORK_LIST.ETH, NETWORK_IDS.ETH],
		[NETWORK_LIST.BSC, NETWORK_IDS.BSC],
		['btc', undefined],
	])('getNetworkId(%s) returns %i', (network, expected) => {
		expect(getNetworkId(network)).toBe(expected);
	});
});

describe('getNetworkNameFromId', () => {
	test.each([
		[NETWORK_IDS.ETH, new EthNetwork().name],
		[NETWORK_IDS.BSC, new BscNetwork().name],
		[999, undefined],
	])('getNetworkNameFromId(%i) returns %s', (networkId, expected) => {
		expect(getNetworkNameFromId(networkId)).toEqual(expected);
	});
});

describe('getNetwork', () => {
	test.each([
		[NETWORK_LIST.ETH, EthNetwork],
		[NETWORK_LIST.BSC, BscNetwork],
		[undefined, EthNetwork],
		['btc', EthNetwork],
	])('getNetwork(%s) returns %s', (network, expected) => {
		expect(getNetwork(network)).toBeInstanceOf(expected);
	});
});
