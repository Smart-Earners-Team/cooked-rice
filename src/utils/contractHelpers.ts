import { ethers } from "ethers";
import {
  getRiceContractAddress,
  getMulticallAddress,
  getBnbAddress,
} from "./addressHelpers";
import MultiCallAbi from "../config/abi/multicall.json";
import riceContractAbi from "../config/abi/riceContract.json";
import bnbAbi from "../config/abi/bnb.json";
import { simpleRpcProvider } from "./providers";
import { CallSignerType } from "../types";

export const getContract = (
  abi: any,
  address: string,
  signer?: CallSignerType | undefined
) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getMulticallContract = (signer?: CallSignerType) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer);
};

export const getRiceContract = (signer?: CallSignerType) => {
  return getContract(riceContractAbi, getRiceContractAddress(), signer);
};

export const getBnbContract = (signer?: CallSignerType) => {
  return getContract(bnbAbi, getBnbAddress(), signer);
};