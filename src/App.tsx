
import { motion, useInView } from "framer-motion";
import {
  displayDate,
  numberWithCommas,
  secondsToTimeString,
} from "./utils/dateUtils";
import NavBar from "./components/NavBar";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { Connect } from "./components/ConnectButton/ConnectButton";
import contract from "./TokenVesting.json";
import { useMemo, useRef, useState } from "react";
import { formatEther } from "viem";
type VestingSchedule = {
  amountTotal: bigint;
  beneficiary: string;
  cliff: bigint;
  duration: bigint;
  released: bigint;
  slicePeriodSeconds: bigint;
  start: bigint;
};
const nullAddress = "0x0000000000000000000000000000000000000000";

const App = () => {
  const { address } = useAccount();
  const { chain } = useNetwork(); //wagmi

  const navbarRef = useRef(null);
  const headerRef = useRef(null); //References for components

  //InView Hooks
  const navInView = useInView(navbarRef, { amount: 1 });
  const headInView = useInView(headerRef, { amount: 1 });

  //Motion Variants
  const brVariants = {
    initial: { opacity: 0, translateX: -20, translateY: -40 },
    animated: { opacity: 1, translateX: 0, translateY: 0 },
  };

  const tlVariants = {
    initial: { opacity: 0, translateX: +20, translateY: +40 },
    animated: { opacity: 1, translateX: 0, translateY: 0 },
  };

  const tVariants = {
    initial: { opacity: 0, translateY: +40 },
    animated: { opacity: 1, translateY: 0 },
  };


  const timestamp = Math.floor(new Date().getTime() / 1000); //Current Time

  //React State hooks
  const [schedule, setSchedule] = useState<VestingSchedule | null>(null);
  const elapsed = useMemo(() => {
    if (!schedule) return 0;

    return timestamp - Number(schedule.cliff);
  }, [schedule]);
  const vestingRound = useMemo(() => {
    if (!schedule) return 0;
    if (schedule.duration < elapsed) return -1;
    else return Math.floor(elapsed / Number(schedule.slicePeriodSeconds)) + 1;
  }, [elapsed, schedule]);

  const nextVesting = useMemo(() => {
    if (vestingRound === -1 || !schedule) return 0;
    else
      return new Date(
        (Number(schedule.cliff) +
          vestingRound * Number(schedule.slicePeriodSeconds)) *
          1000
      );
  }, [vestingRound]);

  //Wagmi Read & Write
  const { data: vestingSchedule } = useContractRead({
    watch: true,
    address: process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`,
    abi: [...contract.abi],
    functionName: "getVestingSchedule",
    args: [address],
    onSuccess: (data) => {
      setSchedule(data as VestingSchedule);
    },
  });
  const { data: availableAmount } = useContractRead({
    address: process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`,
    abi: [...contract.abi],
    functionName: "getAvailableVestingAmount",
    args: [address],
  });

  const { data: isPaused } = useContractRead({
    address: process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`,
    abi: [...contract.abi],
    functionName: "paused",
  });

  const { writeAsync: release } = useContractWrite({
    abi: [...contract.abi],
    address: process.env.REACT_APP_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "release",
  });

  if (schedule) {
    console.log("AAA", vestingRound, nextVesting);
  }

  console.log("SS",availableAmount)
  return (
    <div>
      <head>
        <title>Rover Finance</title>
        <meta content="Vesting for Rover Contract" name="Rover Vesting" />
      </head>
      <div className="flex flex-col bg-black min-h-[100vh] font-kenia h-auto items-center w-full">
        <motion.div
          ref={navbarRef}
          variants={brVariants}
          className="flex w-full"
          initial={"initial"}
          animate={"animated"}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <NavBar />
        </motion.div>
        <div className="flex grow flex-col w-[90%] h-[100%] my-[4vh] bg-black text-center ">
          <motion.div
            className="text-[4vw] text-transparent font-black font-comfort bg-candy bg-clip-text mt-4 self-center w-max"
            ref={headerRef}
            variants={tlVariants}
            initial={"initial"}
            animate={"animated"}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Vesting Claims
          </motion.div>
          <div className="flex flex-col max-h-[40%] justify-center text-start p-4">
            {!address ? (
              <motion.div
                className="flex flex-col mt-8 items-center text-black"
                variants={tVariants}
                initial={"initial"}
                animate={navInView ? "animated" : "initial"}
                transition={{ duration: 0.4 }}
              >
                <p className="text-transparent bg-foreverLost bg-clip-text mb-[6vh] text-[2.5vw]">
                  Please Connect Your Wallet
                </p>
                <Connect />
              </motion.div>
            ) : chain?.id !== 81041 ? (
              <motion.div
                className="text-transparent text-center bg-foreverLost bg-clip-text mt-[5vh] text-[2.5vw]"
                variants={tVariants}
                initial={"initial"}
                animate={navInView ? "animated" : "initial"}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Please switch to Nordek Chain
              </motion.div>
            ) : schedule && schedule?.beneficiary !== nullAddress ? (
              <motion.div
                className="flex flex-col w-[90%] items-center font-poppins mt-16 self-center"
                variants={tVariants}
                initial={"initial"}
                animate={navInView ? "animated" : "initial"}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-row text-[2.4vw] font-outfit text-transparent bg-harvey bg-clip-text">
                  Total&nbsp;{" "}
                  <p className=" font-extrabold text-transparent bg-mistyMeadow bg-clip-text">
                    ROVE&nbsp;
                  </p>{" "}
                  Allocated: {numberWithCommas(parseFloat(Number(formatEther(schedule.amountTotal)).toFixed(2)))}
                </div>
                <div className="flex flex-row mt-10">
                  <div className="text-[1.5vw] flex flex-col text-transparent bg-margo bg-clip-text">
                    <p className="">Allocation Date: </p>
                    <p className="">Initial Cliff:</p>
                    <p className="">Vesting Frequency:</p>
                    <p className="">Vesting Duration:</p>
                    <p className="">Previously Claimed:</p>
                    <p className="">Claim Available:</p>
                    <p className="font-bold">Next Vesting On:</p>
                  </div>
                  <div className="flex flex-col text-[1.5vw] ml-2 font-outfit text-transparent bg-summerDog bg-clip-text ">
                    <p className="">
                      {"" +
                        displayDate(new Date(Number(schedule.start) * 1000))}
                    </p>
                    <p className="">
                      {secondsToTimeString(
                        Number(schedule.cliff) - Number(schedule.start)
                      ) +
                        " (" +
                        displayDate(new Date(Number(schedule.cliff) * 1000)) +
                        ")"}
                    </p>
                    <p className="">
                      {secondsToTimeString(Number(schedule.slicePeriodSeconds))}
                    </p>
                    <p className="">
                      {secondsToTimeString(Number(schedule.duration))}
                    </p>
                    <p className="">
                      {numberWithCommas(parseFloat(Number(formatEther(BigInt(Number(schedule.released)))).toFixed(2)))} ROVE
                    </p>
                    {availableAmount !== undefined?
                        (
                        <p className="">
                          {numberWithCommas(parseFloat(Number(formatEther(BigInt(Number(availableAmount)))).toFixed(2)))} ROVE
                        </p>
                      ):(<p>0</p>)}
                    <p className="">
                      {"" +
                        (nextVesting === 0
                          ? "Vesting is complete"
                          : displayDate(nextVesting))}
                    </p>
                  </div>
                </div>

                {!isPaused ? (
                  <div className="mt-14 bg-kyoto p-[3px] rounded-[20px]">
                    <button
                      disabled={!(Number(availableAmount) > 0)}
                      className=" bg-black  text-[1.2vw] self-center w-[14vw] h-[4vh] rounded-[20px]"
                      onClick={() => {
                        release();
                      }}
                    >
                      <p
                        className={
                          "text-transparent bg-clip-text " +
                          (!(Number(availableAmount) > 0)
                            ? "bg-megatron"
                            : "bg-subu")
                        }
                      >
                        {" "}
                        {!(Number(availableAmount) > 0)
                          ? "Claimed"
                          : "Claim Now"}
                      </p>
                    </button>
                  </div>
                ) : (
                  <p className="text-transparent text-[3vw] mt-[2vh] bg-clip-text bg-megatron ">
                    Vesting is Under Maintenance Currently
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col text-black items-center"
                variants={tVariants}
                initial={"initial"}
                animate={navInView ? "animated" : "initial"}
                transition={{ duration: 0.4 }}
              >
                <p className="text-red-600 text-[3vw]">
                  Your wallet does not have a vesting schedule.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App
{
  /**  <div className='flex flex-col items-center h-[100%] w-[90%] max-w-[90%]'>
        {
          !address && ( <div className='flex w-1/2 self-center rounded-[10px] text-center mt-10 p-4 text-[5vw] text-red-800 bg-gray-200'>
            <p>
            Please Connect your wallet to see your current vesting status 
            </p>
          </div>)
        }
        </div> */
}
