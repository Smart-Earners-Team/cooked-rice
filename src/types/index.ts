import { ethers } from "ethers";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: React.ReactNode;
  loading?: boolean; 
}

export type CallSignerType = ethers.Signer | ethers.providers.Provider;
