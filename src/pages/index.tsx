import React, { useCallback, useEffect, useState } from "react";
import Section from "../components/layouts/Section";
import SiteLogo from "../components/SiteLogo";
import ConnectWalletButton from "../components/Buttons/ConnectWalletButton";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import cls from "classnames";
import Button from "../components/Buttons";
import { checkTokenAllowance, buyGff } from "../utils/calls";
import useToast from "../hooks/useToast";
import { useAppContext } from "../hooks/useAppContext";
import { getBusdAddress, getGffContractAddress } from "../utils/addressHelpers";
import useApproveToken from "../hooks/useApproveToken";
import { getBusdContract } from "../utils/contractHelpers";
import CopyToClipboard from "../components/Tools/CopyToClipboard";
import { StaticImage } from "gatsby-plugin-image";

const IndexPage = () => {
  const [amountToPay, setAmountToPay] = useState("");
  const [selling, setSelling] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [requestedApproval, setRequestedApproval] = useState(false);

  const {
    wallet: { balance },
    triggerFetchTokens,
  } = useAppContext();
  const { active, library, account } = useActiveWeb3React();
  const { toastError, toastSuccess } = useToast();
  const { onApprove } = useApproveToken(
    getBusdContract(library?.getSigner()),
    getGffContractAddress()
  );

  // Check user Gff allowance
  useEffect(() => {
    (async () => {
      if (account != null && active && library != null) {
        const allowance = await checkTokenAllowance(
          getGffContractAddress(),
          account,
          getBusdAddress(),
          library.getSigner()
        );
        if (allowance.isGreaterThan(0)) {
          setIsApproved(true);
        } else {
          setIsApproved(false);
        }
      } else {
        setIsApproved(false);
      }
    })();
  }, [account, active, library]);

  const handleApprove = useCallback(async () => {
    if (account && library) {
      try {
        setRequestedApproval(true);
        await onApprove();
        setIsApproved(true);
      } catch (e) {
        console.error(e);
        toastError(
          "Error",
          "Please try again. Confirm the transaction and make sure you are paying enough gas!"
        );
        setIsApproved(false);
      } finally {
        setRequestedApproval(false);
      }
    }
  }, [onApprove, account, library, toastError]);

  const handleInputChange: React.FormEventHandler<HTMLInputElement> =
    useCallback(
      async (e) => {
        const val = e.currentTarget.value.replace(/,/g, ".");
        const pattern = /^[0-9]*[.,]?[0-9]{0,18}$/g;
        if (!pattern.test(val)) return;

        const amount = Number.parseFloat(val);
        const bal = Number.parseFloat(balance);

        if (amount > bal) {
          setErrorMsg("Insufficient funds in your wallet");
        } else if (amount < 50) {
          setErrorMsg("Min Purchase value is 50");
        } else if (amount > 1000) {
          setErrorMsg("Max purchase value is 1000");
        } else {
          setErrorMsg("");
        }
        setAmountToPay(val);
      },
      [balance]
    );

  const handleBuyGff = useCallback(async () => {
    if (library) {
      setSelling(true);
      try {
        await buyGff(amountToPay, library.getSigner());
        toastSuccess("Success", "GFF purchased has been sent to your wallet.");
        triggerFetchTokens();
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          `Something went wrong while trying to perform the transaction.
          Confirm the transaction, have enough BUSD in your wallet and make
          sure you are paying enough gas!`
        );
      } finally {
        setSelling(false);
      }
    }
  }, [library, amountToPay]);

  return (
    <main className="min-h-screen w-full">
      <Section noPadding={false}>
        <div className="flex justify-between items-center py-5 mb-10">
          <SiteLogo text="Cooked Rice" />
          <ConnectWalletButton />
        </div>
        <div className="lg:flex lg:justify-between">
          <div className="max-w-xl w-full">
            <p>The AVAX Reward Pool with the lowest Dev fes</p>
            <div className="shadow my-6 bg-white">
              <div className="space-y-2 p-5 bg-red-50/70">
                <BalanceTextBox
                  lable="Contract"
                  value="200.099"
                  symbol="AVAX"
                />
                <BalanceTextBox lable="Wallet" value="200.099" symbol="AVAX" />
                <BalanceTextBox
                  lable="Your Rice"
                  value="200.099"
                  symbol="Rice"
                />
              </div>
              <div className="mt-6">
                <TextInput
                  errorMsg=""
                  isDisabled={false}
                  onChangeHandler={() => {}}
                  value=""
                  onSubmit={() => {}}
                />
              </div>
              <div className="p-5">
                <BalanceTextBox
                  lable="Your Rewards"
                  value="200.099"
                  symbol="Rice"
                />
                <div className="space-x-3 flex justify-between items-center my-6">
                  <Button className="!bg-transparent !text-green-600 !ring-green-600 !hover:bg-transparent">
                    Re-Cook
                  </Button>
                  <Button className="!bg-amber-500 !text-white !ring-amber-600 !hover:bg-amber-700">
                    Eat Rice
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="my-10 lg:my-0">
            <div className="w-60 h-60 bg-red-50 mx-auto my-10"></div>
            <h2 className="text-red-900">Nutritional Facts</h2>
            <BalanceTextBox
              lable="Daily Return"
              value="80"
              symbol="%"
              divider
            />
            <BalanceTextBox lable="APR" value="2900" symbol="%" divider />
            <BalanceTextBox lable="Dev Fee" value="3" symbol="%" divider />
          </div>
        </div>
        <div className="space-y-6 max-w-xl">
          <h2 className="text-red-900">Referral Link</h2>
          <p>
            Earn 12% of the AVAX used to cook rice from anyone who uses your
            referral link
          </p>
          <CopyToClipboard
            title="Your Referral Link"
            content="https://domain.com/hsyheuueejduudyduhdu"
          />
        </div>
        <footer className="text-center mt-10 space-y-3">
          <a href="https://" className="w-11/12 max-w-xs mx-auto block">
            <StaticImage
              src="../images/avax-logo.svg"
              alt="AVAX Logo"
              height={30}
              placeholder="blurred"
              layout="fullWidth"
            />
          </a>

          <div className="flex justify-center items-center space-x-3">
            {[1, 2, 3].map(() => (
              <div className="w-8 h-8 rounded-full shadow-md bg-blue-400" />
            ))}
          </div>

          <div className="text-xs mt-5">
            copyright &copy; Garfield Family - {new Date().getFullYear()}
          </div>
        </footer>
      </Section>
    </main>
  );
};

interface BalanceTextBoxProps {
  lable: string;
  value: string;
  symbol: string;
  divider?: boolean;
}

const BalanceTextBox = (props: BalanceTextBoxProps) => {
  return (
    <p className="flex justify-between items-center text-base md:text-inherit">
      <span>{props.lable}</span>
      {props.divider && <div className="h-0.5 w-1/3 sm:w-20 bg-gray-400" />}
      <span>
        {props.value} {props.symbol}
      </span>
    </p>
  );
};

interface TextInputProps {
  errorMsg: string;
  onChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  value: string;
  isDisabled: boolean;
}

const TextInput = ({
  onChangeHandler,
  onSubmit,
  errorMsg,
  value,
  isDisabled,
}: TextInputProps) => {
  const hasError = errorMsg.length > 0;
  const val = Number.parseFloat(value);
  return (
    <div className="max-w-sm w-full space-y-2 mx-auto">
      <div>
        <input
          type="text"
          className={cls(
            "placeholder-gray-400 outline-none border-none ring-2 ring-gray-100 font-normal",
            "focus:ring-gray-300 focus-within:ring-gray-300 transition-all duration-200",
            "text-gray-700 px-3 py-2 bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed",
            "block w-full",
            {
              ["focus:!ring-transparent focus-within:!ring-transparent text-red-400 bg-red-50"]:
                hasError,
            }
          )}
          placeholder="0 AVAX"
          value={value}
          onChange={onChangeHandler}
        />
      </div>
      <div
        className={cls("text-center text-sm", { ["text-red-400"]: hasError })}
      >
        {errorMsg}
      </div>
      <Button
        onClick={onSubmit}
        className="disabled:!opacity-40 disabled:cursor-not-allowed border-none !shadow-none !block
          mx-auto uppercase text-base"
        disabled={isDisabled}
      >
        Buy GFF
      </Button>
    </div>
  );
};
export default IndexPage;
