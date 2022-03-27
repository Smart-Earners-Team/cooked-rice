import BigNumber from "bignumber.js";
import { getFullDisplayBalance } from "../formatBalance";
import multicall from "./multicall";
import erc20 from "../../config/abi/erc20.json";
import type { CallSignerType } from "../../types";
import { getRiceContract } from "../contractHelpers";
import { isAddress } from "ethers/lib/utils";

export const getTokenBalance = async (
  contractAddress: string,
  account: string,
  decimals: number
) => {
  const calls = [
    {
      address: contractAddress,
      name: "balanceOf",
      params: [account],
    },
  ];
  try {
    const [rawTokenAllowance] = (await multicall(
      erc20,
      calls
    )) as BigNumber.Value[];

    const balance = getFullDisplayBalance(
      new BigNumber(rawTokenAllowance),
      decimals,
      decimals
    );
    return balance;
  } catch (e) {
    return "0.000";
  }
};

// check if a user has allowed spending a token in a specified smart contract
export const checkTokenAllowance = async (
  contractAddress: string,
  account: string,
  tokenAddress: string,
  signer: CallSignerType
) => {
  const calls = [
    {
      address: tokenAddress,
      name: "allowance",
      params: [account, contractAddress],
    },
  ];

  const [rawTokenAllowance] = (await multicall(
    erc20,
    calls,
    signer
  )) as BigNumber.Value[];
  return new BigNumber(rawTokenAllowance);
};

export const reCookRice = async (ref: string, signer: CallSignerType) => {
  if (isAddress(ref)) {
    const contract = getRiceContract(signer);
    const tx = await contract.reCookRice(ref);
    const receipt = await tx.wait();
    return receipt.status;
  } else {
    throw new Error("You have entered an invalid referral address");
  }
};

export const eatRice = async (signer: CallSignerType) => {
  const contract = getRiceContract(signer);
  const tx = await contract.eatRice();
  const receipt = await tx.wait();
  return receipt.status;
};

export const cookRice = async (ref: string, signer: CallSignerType) => {
  if (isAddress(ref)) {
    const contract = getRiceContract(signer);
    const tx = await contract.cookRice(ref);
    const receipt = await tx.wait();
    return receipt.status;
  } else {
    throw new Error("You have entered an invalid referral address");
  }
};
