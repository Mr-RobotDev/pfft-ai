"use client";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { useState, useEffect, FC } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import HistoryTable from "@components/historyTable";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";
import PulseLoader from "react-spinners/PulseLoader";
import "animate.css/animate.min.css";
import { calculatePayment, toRegularDate } from "@/utils/helper";
interface Subscription {
  date: string;
  credit: number;
  amount: number;
  expiry: string;
  orderNo: number;
  // Other properties of the subscription object
}

interface userPayment {
  credit: number;

  // Other properties of the subscription object
}
const Account: FC = () => {
  const router = useRouter();
  const session = useSession().data;
  const [transactions, setTransactions] = useState([]);
  const [userPayment, setUserPayment] = useState<userPayment>();
  const [VAT, setVAT] = useState<string>();
  const [toPay, setToPay] = useState<string>();
  const [orderNo, setOrderNo] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubscriptionValid, setIsSubscriptionValid] =
    useState<boolean>(false);
  const [subscription, setSubscription] = useState<Subscription | undefined>();
  const [selectedOption, setSelectedOption] = useState<string>("1000");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch(
          `/api/getsubscriptionDetails?userID=${session?.user?._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data) {
          const currentDate = new Date().toLocaleDateString();
          const currentDateObj = new Date(currentDate);
          const expiryObj = new Date(data.expiry);

          if (currentDateObj > expiryObj) {
            setIsSubscriptionValid(false);
          } else if (currentDateObj < expiryObj) {
            setIsSubscriptionValid(true);
            setSubscription(data);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    if (session?.user?._id) checkSubscription();
  }, [userPayment]);

  useEffect(() => {
    const { vatValue, ToPay } = calculatePayment(selectedOption);
    setVAT(vatValue);
    setToPay(ToPay);
  }, [selectedOption]);

  //call for getting current credits
  useEffect(() => {
    if (session?.user?._id) {
      getUserPayment();
      fetchTransactions();
      getPaymentRecordList();
    }
  }, [session?.user?._id]);

  const getPaymentRecordList = async () => {
    try {
      const response = await fetch(`/api/getPaymentRecordList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setOrderNo(((parseInt(data) + 1) as any).toString().padStart(6, "0"));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const getUserPayment = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/getUserPayment?userID=${session?.user?._id}`,
      method: "GET",
    };

    try {
      const data = await APICaller(options);
      if (!data) {
        setUserPayment({ credit: 0 });
      } else setUserPayment(data);
      return;
    } catch (error) {
      console.error(error); // Handle the error
    }
  };
  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `/api/transaction?userID=${session?.user?._id}`
      );
      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      console.error("Error retrieving transaction history:", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function extractInitials(str: string) {
    const words = str?.split(" ");
    const initials = words?.map((word: string) => word.charAt(0).toUpperCase());
    const username = initials?.join("");

    return username;
  }

  return (
    <Main meta={<Meta title="Accounts" description="Accounts" />}>
      {orderNo ? (
        <div
          className="sm:mx-5 mx-2 overflow-x-hidden overflow-y-auto lg:overflow-hidden
      slg:mx-7
      xl:mx-10"
        >
          {/* Main Heading */}
          <div className="grid grid-rows-1 slg:grid-cols-10 md:mx-12 ">
            <div
              className="row-span-1 grid-rows-1 text-center
        slg:col-span-9"
            >
              <div className="row-span-1">
                <h1
                  className="text-black-100 text-[27px] font-courierPrime font-bold
                    slg:text-[35px]
                    xl:text-[55px]
                    animate__animated animate __slideInLeft"
                >
                  ACCOUNT
                </h1>
              </div>
              <div className="row-span-1">
                <div
                  className="text-[#44576D] text-[12px] font-courierPrime font-semibold
                xs:text-[13px]
                sm:text-[14px]
                slg:text-[22px]
                xl:text-[25px]
                animate__animated animate __slideInRight"
                >
                  Manage Account settings and billing Information
                </div>
              </div>
            </div>
            <div
              className="row-span-1 grid order-first 
              slg:col-span-1 slg:order-2 
              justify-center lg:justify-end
              "
            >
              <div
                className="
                w-fit
                slg:absolute "
              >
                <div
                  onClick={toggleDropdown}
                  className="flex slg:justify-right slg:relative justify-center"
                >
                  <img
                    className={`object-cover rounded-full cursor-pointer
                  3xl:[10rem]
                  2xl:ml-[8.5rem]
                  xl:ml-[7.75rem]
                  lg:ml-[5.5rem]
                  slg:ml-[5rem]
                  w-[45px] h-[45px]
                  sm:w-[50px] sm:h-[50px]
                  slg:w-[40px] slg:h-[40px]
                  xl:w-[60px] xl:h-[60px]
                    ${isOpen ? "" : ""}`}
                    src="/assets/images/menu_icon.svg"
                    alt="Image"
                  />
                </div>

                {isOpen && (
                  <div className="min-w-content xl:w-[80%] mt-[1.5rem]  border-[#FF4738] md:ml-8 ml-2 sm:mr-0 md:mr-5 slg:mr-0 xl:mr-0">
                    <ul>
                      <li
                        onClick={() => {
                          router.push("/");
                        }}
                        className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] px-5 py-2
                        slg:text-[18px] slg:px-1 slg:py-1 font-courierPrime
                        xl:px-5 xl:py-3 xl:text-[25px] 
                        "
                      >
                        PFFT
                      </li>

                      <li
                        onClick={() => {
                          router.push("/history");
                        }}
                        className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] px-3 py-2
                      slg:text-[18px] slg:px-1 slg:py-1 font-courierPrime
                        xl:px-5 xl:py-3 xl:text-[25px] 
                        "
                      >
                        History
                      </li>
                      {!isSubscriptionValid && (
                        <li
                          onClick={() => {
                            router.push("/payment");
                          }}
                          className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] px-3 py-2
                      slg:text-[18px] slg:px-1 slg:py-1 font-courierPrime
                      xl:px-5 xl:py-3 xl:text-[25px]  
                        "
                        >
                          Payment
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Username */}
          <div className="w-fill md:w-fit bg-black md:flex md:grid-cols-2 md:gap-4  md:my-10 my-4 grid-rows-1 grid justify-center md:justify-left gap-2 animate__animated animate__zoomInRight">
            <div className="md:col-span-1 row-span-1 justify-center ">
              <div className="relative flex justify-center">
                <div
                  className=" h-[60px] flex w-[60px] relative rounded-full bg-[#FF8E4C] border-2 border-[#FF0000] justify-center
                    xs:h-[80px] xs:w-[80px]
                    sm:h-[75px] sm:w-[75px]
                    md:h-[90px] md:w-[90px]
                    slg:h-[100px] slg:w-[100px]
                    lg:h-[120px] lg:w-[120px]
                    xl:h-[144px] xl:w-[144px] xl:border-4
                    "
                >
                  <div className="relative flex justify-center ">
                    <div
                      className="font-[700] text-white font-courierPrime 
                    text-[40px]
                  xs:text-[54px]
                  md:text-[60px]
                  slg:text-[70px] 
                  lg:text-[80px] 
                  xl:text-[95px]"
                    >
                      {extractInitials(session?.user?.name as string)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1 row-span-1 md:text-left text-center">
              <div
                className="
                 md:mt-[1rem]
                 lg:mt-[1.25rem]
                 lg:col-span-4
                 xl:col-span-10 xl:mt-[2rem]"
              >
                <div
                  className="font-bold text-[14px] text-black-100  font-courierPrime
                xs:text-[20px]
                md:text-[25px]
                xl:text-[25px] 
                "
                >
                  {session?.user?.name}
                </div>
                <div
                  className="font-[400] text-[14px] text-black-100 font-courierPrime leading-6
                xs:text-[18px]
                md:text-[20px]
                xl:text-[22px]
                "
                >
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>
          {/* Cards */}
          <div className="grid  slg:grid-cols-2 grid-rows-1 sm:mx-2  my-[3rem] gap-10 h-fit">
            <div className="col-span-1 sm:grid grid-rows-2 md:gap-[3rem] sm:gap-[1rem] ">
              <div className="row-span-1  bg-[#FDDDD2] border-[#FF884A] border-[1px] rounded-[15px] sm:h-fill sm:mb-6 mb-[3rem] h-fit  animate__animated animate__zoomInLeft">
                <div className="text-center  items-center -mt-5">
                  <span
                    className="rounded-3xl 
                      bg-gradient-red-1-to-red-2
                      font-[400] xl:font-[500]   text-[white] font-courierPrime 
                      xl:h-[60px] xl:w-[148px] xl:px-9 xl:py-4 xl:text-[28px]
                      md:text-[28px]
                      h-[20px] w-[140px] text-[16px] px-4 py-4"
                  >
                    credits
                  </span>
                </div>
                <div className="text-center md:py-[4rem] sm:py-[4rem] py-[2rem]">
                  <h1
                    className="text-[#44576D] font-courierPrime font-bold 
                  text-[15px]
                  xs:text-[15px]
                  xms:text-[20px] 
                  md:text-[28px]
                  slg:text-[26px]
                  xl:text-[28px]"
                  >
                    Total Credits in your account:
                  </h1>
                  <div
                    className="font-courierPrime font-extrabold mt-5 
                    text-black-100
                  text-[14px]
                  xs:text-[28px] xs:mt-3
                  xms:text-[24px]
                  md:text-[28px]
                  slg:text-[25px]"
                  >
                    {userPayment?.credit != null ? (
                      <>
                        <span>
                          {userPayment?.credit}.
                          <sub style={{ fontSize: "0.8em" }}>00</sub>
                        </span>
                      </>
                    ) : (
                      <div className="justify-center flex items-center">
                        <PulseLoader color="#FF854A" size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`row-span-1 bg-[#FDDDD2] border-[#FF884A] border-[1px] rounded-[15px] h-fill animate__animated animate__zoomInLeft ${
                  transactions ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (transactions) {
                    router.push({
                      pathname: "/paymentHistory",
                    });
                  }
                }}
              >
                <div className="text-center justify-center items-center -mt-5">
                  <span
                    className="rounded-3xl 
                      bg-gradient-red-1-to-red-2
                      xl:font-normal   text-white font-courierPrime font-light 
                      xl:h-[60px] xl:w-[148px] xl:px-9 xl:py-4 xl:text-[28px]
                      md:text-[28px]
                      h-[20px] w-[140px] text-[16px] px-4 py-4"
                  >
                    Payment History
                  </span>
                </div>
                <HistoryTable transactions={transactions} loading={loading} />
              </div>
            </div>
            {!loading && (
              <>
                {" "}
                {isSubscriptionValid ? (
                  <div className="col-span-1 bg-[#FDDDD2]  border-[#FF884A] border-[1px]  rounded-[15px] h-fill animate__animated animate__zoomInUp ">
                    <div className="text-center justify-center items-center -mt-5">
                      <span
                        className="rounded-3xl 
                    bg-gradient-red-1-to-red-2
                    font-[400] xl:font-[500]   text-[white] font-courierPrime 
                    xl:h-[60px] xl:w-[148px] xl:px-9 xl:py-4 xl:text-[30px]
                    md:text-[28px]
                    h-[20px] w-[140px] text-[16px] px-4 py-4"
                      >
                        Wallet
                      </span>
                    </div>

                    <div className="mx-8">
                      <div className="md:text-[22px] mt-[40px] slg:mt-[70px] font-courierPrime lg:text-[24px] text-black-100 text-center text-[15px] font-extrabold">
                        You are currently subscribed to our Monthly Plan
                      </div>
                      <div className="border-b-2 border-dashed border-[#44576D] w-full mt-[2rem] mb-5"></div>
                      <table className="table-auto mt-6 w-full">
                        <tbody>
                          <tr className="font-courierPrime text-black-100">
                            <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold ">
                              Order Number
                            </td>
                            <td className="text-end xms:text-[20px]">
                              {subscription?.orderNo
                                .toString()
                                .padStart(6, "0")}
                            </td>
                          </tr>
                          <tr className="font-courierPrime text-black-100">
                            <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold ">
                              Credits Purchased
                            </td>
                            <td className="text-end xms:text-[20px]">
                              {subscription?.credit}
                            </td>
                          </tr>
                          <tr className="font-courierPrime text-black-100">
                            <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold ">
                              Amount paid
                            </td>
                            <td className="text-end xms:text-[20px]">
                              {subscription?.amount.toFixed(2)}$
                            </td>
                          </tr>
                          <tr className="font-courierPrime text-black-100">
                            <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold ">
                              Expiry
                            </td>
                            <td className="text-end xms:text-[20px]">
                              {toRegularDate(subscription?.expiry as string)}
                            </td>
                          </tr>
                          <tr className="font-courierPrime text-black-100">
                            <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold ">
                              Purchased On
                            </td>
                            <td className="text-end xms:text-[20px]">
                              {toRegularDate(subscription?.date as string)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-1 bg-[#FDDDD2]  border-[#FF884A] border-[1px]  rounded-[15px] h-fill animate__animated animate__zoomInUp ">
                    <div className="text-center justify-center items-center -mt-5">
                      <span
                        className="rounded-3xl 
              bg-gradient-red-1-to-red-2
              font-[400] xl:font-[500]   text-[white] font-courierPrime 
              xl:h-[60px] xl:w-[148px] xl:px-9 xl:py-4 xl:text-[28px]
              md:text-[28px]
              h-[20px] w-[140px] text-[16px] px-4 py-4"
                      >
                        Payment Plan
                      </span>
                    </div>
                    <div className="mx-5 my-6">
                      <h1
                        className="text-black-100 font-courierPrime 
                  xl:text-[18px]"
                      >
                        Billing Cycle
                      </h1>
                      <div>
                        <label>
                          <input
                            type="radio"
                            value="1000"
                            checked={selectedOption === "1000"}
                            onChange={handleOptionChange}
                            className="accent-[#E86B34]"
                          />
                          <span className="ml-2 mt-1 font-courierPrime sm:text-[16px] text-[14px] ">
                            Monthly (1000 Credit in
                            {" " +
                              process.env.MONTHLY_PAYMENT_AMOUNT_1000_CREDIT}
                            $)
                          </span>
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            value="2000"
                            checked={selectedOption === "2000"}
                            onChange={handleOptionChange}
                            className="accent-[#E86B34]"
                          />
                          <span className="ml-2 mt-1 font-courierPrime sm:text-[16px] text-[14px] ">
                            Monthly (2000 Credit in
                            {" " +
                              process.env.MONTHLY_PAYMENT_AMOUNT_2000_CREDIT}
                            $)
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="mx-8">
                      <table className="table-auto mt-6 w-full">
                        <tbody>
                          <tr className="font-courierPrime ">
                            <td className="py-4 md:text-[22px] lg:text-[24px] text-[15px]  md:py-3 font-extrabold text-[#44576D]">
                              VAT ({process.env.VAT_TAX}%)
                            </td>
                            <td className=" text-end xms:text-[20px] text-[#0A0F19] font-bold">
                              {" "}
                              {VAT}{" "}
                            </td>
                          </tr>
                          <tr className="font-courierPrime">
                            <td className="  py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold text-[#44576D] ">
                              Order Number
                            </td>
                            <td className="text-end xms:text-[20px] text-[#0A0F19] font-bold">
                              {orderNo !== null ? orderNo : ""}
                            </td>
                          </tr>

                          <tr className="font-courierPrime text-[#44576D]">
                            <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold ">
                              Credits Purchased
                            </td>
                            <td className="text-end xms:text-[20px] text-[#0A0F19] font-bold">
                              {selectedOption}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="border-b-2 border-dashed border-[#44576D] w-full mt-[4rem] mb-5"></div>
                    </div>
                    <div className=" border-[#44576D] grid grid-cols-3 text-between mt-2 mx-8">
                      <div
                        className="text-[#44576D] col-span-2 font-courierPrime font-bold
                      text-start
                      text-[14px]
                      lg:text-[24px]
                      md:text-[28px]
                      slg:text-[24px]
                      2xl:text-[28px] mt-2"
                      >
                        Amount to be paid =
                      </div>
                      <div>
                        <div
                          className="font-courierPrime col-span-1 font-extrabold mt-5 
                    text-[#44576D]
                    text-end
                    text-[16px]
                    xs:text-[18px] xs:mt-3
                    xms:text-[17px]
                    md:text-[28px]
                    slg:text-[25px]"
                        >
                          {toPay?.toString().split(".")[0]}.
                          <sub style={{ fontSize: "0.8em" }}>
                            {
                              toPay
                                ?.toString()
                                .split(".")[1]
                                ?.substring(0, 2) as string
                            }
                          </sub>{" "}
                          USD
                        </div>
                      </div>
                    </div>
                    <div className="text-center my-[2.6rem] ">
                      <button
                        onClick={() => {
                          router.push({
                            pathname: "/payment",
                            query: {
                              selectedOption: selectedOption,
                            },
                          });
                        }}
                        className=" px-10 py-2 bg-gradient-red-1-to-red-2 text-white font-courierPrime font-bold "
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="justify-center flex items-center">
          <PulseLoader color="#FF854A" size={20} />
        </div>
      )}
    </Main>
  );
};

export default Account;
