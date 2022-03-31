import { parseUnits } from "ethers/lib/utils";

export enum ChainId {
  MAINNET = 43114,
  TESTNET = 97,
}

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: "https://snowtrace.io",
  [ChainId.TESTNET]: "https://testnet.bscscan.com",
};

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET];

export const addresses = {
  riceContract: {
    43114: "",
    97: "0xbAd87ea70A47BD09416B3a15e30BF7386115D0e4",
  },
};

export enum GAS_PRICE {
  default = "5",
  fast = "6",
  instant = "7",
  testnet = "10",
}

export const GAS_PRICE_GWEI = {
  default: parseUnits(GAS_PRICE.default, "gwei").toString(),
  fast: parseUnits(GAS_PRICE.fast, "gwei").toString(),
  instant: parseUnits(GAS_PRICE.instant, "gwei").toString(),
  testnet: parseUnits(GAS_PRICE.testnet, "gwei").toString(),
};
