import { BigNumber } from 'bignumber.js';

export const DEFAULT_FEES = {
	keeperFee: new BigNumber('0.0005'),
	daoFee: new BigNumber('0'),
	btcGasFee: new BigNumber('0'),
	mintFee: new BigNumber('0'),
	liquidityPoolFee: new BigNumber('0'),
};

export const BTC_NETWORK_FEE = new BigNumber('0.0007');

export const LIB_P2P_URI = '/dns4/lourdehaufen.dynv6.net/tcp/443/wss/p2p-webrtc-star/';
