import { ethers } from "ethers";
import {
  getBusdAddress,
  getGffAddress,
  getGffContractAddress,
  getMulticallAddress,
} from "./addressHelpers";
import MultiCallAbi from "../config/abi/multicall.json";
import gffContractAbi from "../config/abi/gffContract.json";
import gffAbi from "../config/abi/gff.json";
import busdAbi from "../config/abi/busd.json";
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

export const getGffContractContract = (signer?: CallSignerType) => {
  return getContract(gffContractAbi, getGffContractAddress(), signer);
};

export const getGffTokenContract = (signer?: CallSignerType) => {
  return getContract(gffAbi, getGffAddress(), signer);
};

export const getBusdContract = (signer?: CallSignerType) => {
  return getContract(busdAbi, getBusdAddress(), signer);
};
