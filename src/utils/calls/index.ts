import BigNumber from "bignumber.js";
import type { CallSignerType } from "../../types";
import { getRiceContract } from "../contractHelpers";
import { isAddress } from "ethers/lib/utils";
import { BIG_TEN } from "../bigNumber";

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

export const cookRice = async (
  amount: string,
  ref: string,
  signer: CallSignerType
) => {
  if (isAddress(ref)) {
    const value = new BigNumber(amount).times(BIG_TEN.pow(18)).toJSON();
    const contract = getRiceContract(signer);
    const tx = await contract.cookRice(ref, { value });
    const receipt = await tx.wait();
    return receipt.status;
  } else {
    throw new Error("You have entered an invalid referral address");
  }
};
