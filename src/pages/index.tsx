import React, { useCallback, useContext, useEffect, useState } from "react";
import Section from "../components/layouts/Section";
import ConnectWalletButton from "../components/Buttons/ConnectWalletButton";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import cls from "classnames";
import Button from "../components/Buttons";
import { reCookRice, eatRice, cookRice } from "../utils/calls";
import useToast from "../hooks/useToast";
import { useAppContext } from "../hooks/useAppContext";
import CopyToClipboard from "../components/Tools/CopyToClipboard";
import { getRiceContract } from "../utils/contractHelpers";
import Footer from "../components/layouts/Footer";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "../utils/bigNumber";
// import VideoPlayer from "../components/Tools/VideoPlayer";
import Navbar from "../components/layouts/Navbar";
import { RefreshContext } from "../contexts/RefreshContext";
import cookedRiceGif from "../media/cooked-rice-animation.gif";
import { PageProps } from "gatsby";
import { getFullDisplayBalance } from "../utils/formatBalance";

const IndexPage = (props: PageProps) => {
  const [amountToPay, setAmountToPay] = useState("");
  const [contractBal, setContractBal] = useState("0");
  const [riceBal, setRiceBal] = useState("0");
  const [reCooking, setReCooking] = useState(false);
  const [cooking, setCooking] = useState(false);
  const [avaxRewards, setAvaxRewards] = useState("0");
  const [eating, setEating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    wallet: { balance },
    triggerFetchTokens,
    refAddress,
  } = useAppContext();
  const { active, library, account } = useActiveWeb3React();
  const { toastError, toastSuccess } = useToast();
  const { fast } = useContext(RefreshContext);

  // Get AVAX Balance in the contract
  useEffect(() => {
    (async () => {
      const contract = getRiceContract();
      try {
        const { _hex } = await contract.getBalance();
        const bal = new BigNumber(_hex).div(BIG_TEN.pow(18));
        setContractBal(bal.toJSON());
      } catch (err) {
        setContractBal("0");
      }
    })();
  }, [library, riceBal, balance, avaxRewards]);

  // Get User Rice and avax rewards
  useEffect(() => {
    (async () => {
      if (account && library) {
        const contract = getRiceContract(library.getSigner());
        try {
          // User rice bal
          const { _hex: myRice } = await contract.getMyMiners(account);
          const rice = new BigNumber(myRice).toJSON(); // How many decimals?
          // User rwards in avax
          const { _hex: riceForRewards } = await contract.getMyRice(account);
          const { _hex: avaxRewards } = await contract.calculateRiceSell(
            riceForRewards
          );
          const avax = getFullDisplayBalance(
            new BigNumber(avaxRewards),
            18,
            18
          );

          setRiceBal(rice);
          setAvaxRewards(avax);
        } catch (err) {
          console.error(err);
          setRiceBal("0");
          setAvaxRewards("0");
        }
      } else {
        setRiceBal("0");
        setAvaxRewards("0");
      }
    })();
  }, [account, library, contractBal, balance, fast, active]);

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
        // console.error(err);
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
        toastSuccess(
          "Success",
          "Your Rice is cooking now, sit back and relax."
        );
        triggerFetchTokens();
        setAmountToPay("");
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

  // Can start video
  /* const canStart = useCallback(
    () => Number.parseFloat(riceBal) > 0,
    [riceBal, account, active, library]
  ); */

  const {
    location: { origin },
  } = props; // Page props

  return (
    <main className="min-h-screen w-full">
      <Section>
        <Navbar />
        <div className="lg:flex lg:justify-between mt-8">
          <div className="max-w-xl lg:max-w-lg w-full mx-auto lg:mx-0">
            <p className="text-center md:text-left">
              The AVAX Reward Pool with the lowest Dev fees
            </p>
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
                      value={avaxRewards}
                      symbol="AVAX"
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
                <div className="py-2 text-xs text-center bg-white flex flex-col items-center space-y-3">
                  <p>Please connect your wallet first</p>
                  <ConnectWalletButton />
                </div>
              )}
            </div>
          </div>
          <div className="my-10 lg:my-0 max-w-xl lg:max-w-xs mx-auto lg:mx-0">
            <div
              className="w-full min-h-[250px] bg-[#fbfcfd] mx-auto mb-8 transition-all
               duration-150"
            >
              {/* <VideoPlayer canStartEngine={canStart} /> */}
              <img
                src={cookedRiceGif}
                alt="Animated gif of a hot served rice"
                className="w-full"
              />
            </div>
            <h2 className="text-red-900 text-center md:text-left">
              Nutritional Facts
            </h2>
            <BalanceTextBox lable="Daily Return" value="8" symbol="%" divider />
            <BalanceTextBox lable="APR" value="2920" symbol="%" divider />
            <BalanceTextBox lable="Dev Fee" value="3" symbol="%" divider />
          </div>
        </div>
        <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
          <h2 className="text-red-900 text-center md:text-left">
            Referral Link
          </h2>
          <p className="text-center md:text-left">
            Earn 12% of the AVAX used to cook rice from anyone who uses your
            referral link
          </p>
          <CopyToClipboard
            title="Your Referral Link"
            content={
              account == null
                ? "Connect your wallet to see your referral address"
                : `${origin}/?ref=${account}`
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
