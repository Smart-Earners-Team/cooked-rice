import BigNumber from "bignumber.js";
import { getFullDisplayBalance } from "../formatBalance";
import multicall from "./multicall";
import erc20 from "../../config/abi/erc20.json";
import type { CallSignerType } from "../../types";
import { BIG_TEN } from "../bigNumber";
import { getGffContractContract } from "../contractHelpers";

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

export const buyGff = async (amount: string, signer: CallSignerType) => {
  const value = new BigNumber(amount)
    .times(BIG_TEN.pow(18))
    .toFixed()
    .toString();

  const tx = await getGffContractContract(signer).swap(value);
  const receipt = await tx.wait();
  return receipt.status;
};
