import React, { useCallback, useEffect, useState } from "react";
import Section from "../components/layouts/Section";
import SiteLogo from "../components/SiteLogo";
import ConnectWalletButton from "../components/Buttons/ConnectWalletButton";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import cls from "classnames";
import Button from "../components/Buttons";
import { reCookRice, eatRice, cookRice } from "../utils/calls";
import useToast from "../hooks/useToast";
import { useAppContext } from "../hooks/useAppContext";
import CopyToClipboard from "../components/Tools/CopyToClipboard";
import { getRiceContract } from "../utils/contractHelpers";
import useWallet from "../hooks/useWallet";
import Footer from "../components/layouts/Footer";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "../utils/bigNumber";

const IndexPage = () => {
  const [amountToPay, setAmountToPay] = useState("");
  const [contractBal, setContractBal] = useState("0");
  const [riceBal, setRiceBal] = useState("0");
  const [reCooking, setReCooking] = useState(false);
  const [cooking, setCooking] = useState(false);
  const [riceRewards, setRiceRewards] = useState("0");
  const [eating, setEating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    wallet: { balance },
    triggerFetchTokens,
    refAddress,
  } = useAppContext();
  const { active, library, account } = useActiveWeb3React();
  const { toastError, toastSuccess } = useToast();
  const { onPresentConnectModal } = useWallet();

  // Get AVAX Balance in the contract
  useEffect(() => {
    (async () => {
      if (library) {
        const contract = getRiceContract(library.getSigner());
        const { _hex } = await contract.getBalance();
        const bal = new BigNumber(_hex).div(BIG_TEN.pow(18));
        setContractBal(bal.toJSON());
      }
    })();
  }, [library, riceRewards]);

  // Get User Rice
  useEffect(() => {
    (async () => {
      if (account && library) {
        const contract = getRiceContract(library.getSigner());
        const { _hex } = await contract.getMyRice(account);
        const rice = new BigNumber(_hex).toJSON(); // How many decimals?
        setRiceBal(rice);
      }
    })();
  }, [account, library, riceRewards]);

  // Get Rice rewards
  useEffect(() => {
    (async () => {
      if (account && library) {
        const contract = getRiceContract(library.getSigner());
        try {
          const rewards = await contract.riceRewards(account);
          console.log(rewards);
        } catch (err) {
          console.error(err, "Get rice rewards error");
          setRiceRewards("0");
        }
      }
    })();
  }, [account, library]);

  const handleInputChange: React.FormEventHandler<HTMLInputElement> =
    useCallback(
      async (e) => {
        const val = e.currentTarget.value.replace(/,/g, ".");
        const pattern = /^[0-9]*[.,]?[0-9]{0,18}$/g;
        if (!pattern.test(val)) return;

        const amount = new BigNumber(val);
        const bal = new BigNumber(balance);
        // const bal = Number.parseFloat("100");

        if (amount.isGreaterThan(bal)) {
          setErrorMsg("Insufficient funds in your wallet");
        } else {
          setErrorMsg("");
        }
        setAmountToPay(val);
      },
      [balance]
    );

  const handleReCookRice = useCallback(async () => {
    if (library) {
      setReCooking(true);
      try {
        await reCookRice(refAddress, library.getSigner());
        toastSuccess("Success", "Your Rice has been re-cooked");
        triggerFetchTokens();
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setReCooking(false);
      }
    }
  }, [library, refAddress]);

  const handleCookRice = useCallback(async () => {
    if (library) {
      setCooking(true);
      try {
        await cookRice(amountToPay, refAddress, library.getSigner());
        toastSuccess("Success", "Your Rice is cooking now, sitback and relax.");
        triggerFetchTokens();
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setCooking(false);
      }
    }
  }, [library, amountToPay, refAddress]);

  const handleEatRice = useCallback(async () => {
    if (library) {
      setEating(true);
      try {
        await eatRice(library.getSigner());
        toastSuccess("Success", "Enjoying your rice? Smile.");
        triggerFetchTokens();
      } catch (err) {
        console.error(err);
        toastError(
          "Error",
          "Something went wrong while trying to perform the transaction."
        );
      } finally {
        setEating(false);
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
          <div className="max-w-xl w-full mx-auto lg:mx-0">
            <p>The AVAX Reward Pool with the lowest Dev fees</p>
            <div className="shadow my-6 bg-white">
              <div className="space-y-2 p-5 bg-red-600 text-white">
                <BalanceTextBox
                  lable="Contract"
                  value={contractBal}
                  symbol="AVAX"
                />
                <BalanceTextBox lable="Wallet" value={balance} symbol="AVAX" />
                <BalanceTextBox
                  lable="Your Rice"
                  value={riceBal}
                  symbol="Rice"
                />
              </div>

              {active && (
                <React.Fragment>
                  <div className="mt-6">
                    <TextInput
                      errorMsg={errorMsg}
                      onChangeHandler={handleInputChange}
                      value={amountToPay}
                      onSubmit={handleCookRice}
                      trx={cooking}
                      isDisabled={
                        cooking ||
                        errorMsg.length > 0 ||
                        Number.isNaN(Number.parseFloat(amountToPay))
                      }
                    />
                  </div>
                  <div className="p-5">
                    <BalanceTextBox
                      lable="Your Rewards"
                      value={riceRewards}
                      symbol="Rice"
                    />
                    <div className="space-x-3 flex justify-between items-center my-6">
                      <Button
                        onClick={handleReCookRice}
                        disabled={reCooking || !active}
                        loading={reCooking}
                        className="!bg-transparent !text-green-600 !ring-green-600 hover:!bg-green-50"
                      >
                        Re-Cook
                      </Button>
                      <Button
                        onClick={handleEatRice}
                        disabled={eating || !active}
                        loading={eating}
                        className="!bg-amber-500 !text-white !ring-amber-600 hover:!bg-amber-600"
                      >
                        Eat Rice
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              )}
              {!active && (
                <div
                  onClick={onPresentConnectModal}
                  className="py-2 text-xs text-center bg-gray-50 underline text-blue-600
                    cursor-pointer"
                >
                  Please connect your wallet first
                </div>
              )}
            </div>
          </div>
          <div className="my-10 lg:my-0">
            <div className="w-60 h-60 bg-red-50 mx-auto my-10"></div>
            <h2 className="text-red-900">Nutritional Facts</h2>
            <BalanceTextBox lable="Daily Return" value="8" symbol="%" divider />
            <BalanceTextBox lable="APR" value="2920" symbol="%" divider />
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
            content={
              account == null
                ? "Connect your wallet to see your refferal address"
                : `https://cookedrice.io/${account}`
            }
            canCopy={account != null}
          />
        </div>
        <Footer />
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
    <div className="flex justify-between items-center text-base md:text-inherit">
      <span>{props.lable}</span>
      {props.divider && <div className="h-0.5 w-1/3 sm:w-20 bg-gray-400" />}
      <span>
        {props.value} {props.symbol}
      </span>
    </div>
  );
};

interface TextInputProps {
  errorMsg: string;
  onChangeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  value: string;
  isDisabled: boolean;
  trx: boolean; // transaction
}

const TextInput = ({
  onChangeHandler,
  onSubmit,
  errorMsg,
  value,
  isDisabled,
  trx,
}: TextInputProps) => {
  const hasError = errorMsg.length > 0;
  return (
    <div className="max-w-sm w-full space-y-2 mx-auto">
      <div>
        <input
          type="text"
          className={cls(
            "placeholder-gray-400 outline-none border-none ring-2 ring-gray-200 font-normal",
            "focus:ring-gray-300 focus-within:ring-gray-300 transition-all duration-200",
            "text-gray-700 px-3 py-2 disabled:opacity-70 disabled:cursor-not-allowed",
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
          mx-auto text-base"
        disabled={isDisabled}
        loading={trx}
      >
        Cook Rice
      </Button>
    </div>
  );
};
export default IndexPage;
