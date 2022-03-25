import { useCallback } from "react";
import { ethers, Contract } from "ethers";
import { useCallWithGasPrice } from "./useCallWithGasPrice";

const useApproveToken = (spenderContract: Contract, tokenAddress: string) => {
  const { callWithGasPrice } = useCallWithGasPrice();
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(spenderContract, "approve", [
      tokenAddress,
      ethers.constants.MaxUint256,
    ]);
    const receipt = await tx.wait();
    return receipt.status;
  }, [tokenAddress, spenderContract, callWithGasPrice]);

  return { onApprove: handleApprove };
};

export default useApproveToken;
