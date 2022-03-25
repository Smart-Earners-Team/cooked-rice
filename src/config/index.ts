import { parseUnits } from "ethers/lib/utils";

export enum ChainId {
  MAINNET = 56,
  TESTNET = 97,
}

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: "https://bscscan.com",
  [ChainId.TESTNET]: "https://testnet.bscscan.com",
};

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET];

export const tokens = {
  gff: { 56: "0x5BC1dE85Fb09eDEefD54869cd8cFB20B30574CE8", 97: "" },
  busd: {56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", 97: ""}
};
export const addresses = {
  multiCall: {
    56: "0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B",
    97: "0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576",
  },
  gffContract: {
    56: "0xc76c6ed1820d727e13E69625857B1Eda57431357",
    97: "",
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
