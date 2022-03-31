import { ethers } from "ethers";
import {
  getRiceContractAddress,
} from "./addressHelpers";
import riceContractAbi from "../config/abi/riceContract.json";
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

export const getRiceContract = (signer?: CallSignerType) => {
  return getContract(riceContractAbi, getRiceContractAddress(), signer);
};
