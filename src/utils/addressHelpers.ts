import { addresses, ChainId, tokens } from "../config";
import { Address } from "../config/types";

export const getAddress = (address: Address): string => {
  const chainId = process.env.GATSBY_CHAIN_ID as unknown as keyof Address;
  return (address[chainId] ? address[chainId] : address[ChainId.MAINNET])!;
};

export const getMulticallAddress = () => getAddress(addresses.multiCall);

export const getGffContractAddress = () => getAddress(addresses.gffContract);

export const getGffAddress = () => getAddress(tokens.gff);

export const getBusdAddress = () => getAddress(tokens.busd);
