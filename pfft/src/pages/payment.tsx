'use client'
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import "animate.css/animate.min.css";
import StripePaymentForm from "@/components/stripePaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import PulseLoader from "react-spinners/PulseLoader";
import { calculatePayment } from "@/utils/helper";

import { ToastContainer } from "react-toastify";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const Payment: FC = () => {
  const router = useRouter();
  const session = useSession().data;
  const selectedOption1 = router.query.selectedOption as string;
  const [isOpen, setIsOpen] = useState(false);
  const [VAT, setVAT] = useState<string>();
  const [toPay, setToPay] = useState<string>();
  const [orderNo, setOrderNo] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("1000");
  const handleLoadingChange = (value:any) => {
    setLoading(value);
  };
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    if(selectedOption1==="2000")
    {
      setSelectedOption("2000");
    }
    else{
      setSelectedOption("1000");
    }
  },[selectedOption1])

  useEffect(() => {
    const getPaymentRecordList = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getPaymentRecordList`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setOrderNo((parseInt(data) + 1).toString().padStart(6, "0")as unknown as number);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    if (session?.user?._id) getPaymentRecordList();
  }, [session]);

  useEffect(() => {
    const { vatValue, ToPay } = calculatePayment(selectedOption);
    setVAT(vatValue);
    setToPay(ToPay);
  }, [selectedOption]);

  return (
    <Main meta={<Meta title="Payment" description="Payment" />}>
      <div className="mx-8">
        <ToastContainer />
        {loading ? (
          <PulseLoader />
        ) : (
          <>
            {/* Main Heading */}
            <div className="grid grid-rows-1 slg:grid-cols-10 lg:mx-6 xl:mx-0">
              <div
                className="row-span-1 grid-rows-1 text-center
        slg:col-span-9"
              >
                <div className="row-span-1">
                  <h1
                    className="text-black-100 text-[27px] font-courierPrime font-bold
         slg:text-[35px]
         xl:text-[55px]"
                  >
                    PAYMENT
                  </h1>
                </div>
                <div className="row-span-1">
                  <div
                    className="text-[#44576D] text-[12px]  font-courierPrime font-semibold
                xs:text-[13px]
                sm:text-[14px]
                slg:text-[22px]
                xl:text-[25px]"
                  >
                    Manage billing Information
                  </div>
                </div>
              </div>
              <div
                className="row-span-1 grid order-first 
              slg:col-span-1 slg:order-2 
              justify-center lg:justify-end min-w-fit
              "
              >
                 <div
                className="
                slg:w-fit
                slg:absolute "
              >
                <div
                  onClick={toggleDropdown}
                  className="flex lg:justify-end slg:relative justify-center slg:w-fit"
                >
                              <img
                                className="cursor-pointer flex justify-end 
                                lg:ml-[5.5rem]
                                slg:ml-[2rem]
                                w-[45px] h-[45px]
                                sm:w-[50px] sm:h-[50px]
                                slg:w-[40px] slg:h-[40px]
                                xl:w-[60px] xl:h-[60px]"
                                src="/assets/images/menu_icon.svg"
                                alt="Image"
                              />
                            </div>

                  {isOpen && (
                  <div className="min-w-content lg:w-[100%] xl:w-[90%] mx-5 mt-[1.5rem]  border-[#FF4738] md:ml-8  sm:mr-0 slg:-ml-2 lg:ml-2  md:mr-5 slg:mr-0 xl:ml-0 xl:mr-10">
                      <ul>
                        <li
                          onClick={() => {
                            router.push("/");
                          }}
                          className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                        slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                        xl:py-4 xl:text-[20px] xl:px-4 lg:px-6
                        "
                        >
                          PFFT
                        </li>
                        <li
                          className="cursor-pointer border-[2px] border-[#FF3633]   text-[black] text-[14px]  bg-[#FDDDD2] py-2
                        slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                        xl:py-4 xl:text-[20px] xl:px-4 font-bold 
                        "
                        >
                          Payment
                        </li>
                        <li
                          onClick={() => {
                            router.push("/history");
                          }}
                          className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                          slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                          xl:py-4 xl:text-[20px] xl:px-4
                          "
                        >
                          History
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="slg:mt-[9rem] lg:mt-[8.5rem] xl:mx-6 xl:mt-[10.5rem] md:grid md:grid-cols-2 gap-8 md:gap-[3rem] xl:gap-[20rem] 2xl:gap-[15rem] lg:gap-[10rem]  grid-rows-1 mx-2 animate__animated animate__zoomInUp min-h-fit min-w-fit ">
              <div className="w-full md:col-span-1 text-center 3xl:pr-[9.5rem] ">
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    orderNo={orderNo}
                    toPay={toPay}
                    credit={selectedOption}
                    handleLoadingChange={handleLoadingChange}
                  />
                </Elements>
              </div>
              <div className="md:col-span-1 row-span-1 my-5 md:my-0 md:text-left">
                <div className="border-[#FF884A] border-[1px]  shadow-xl rounded-[15px] h-full">
                  <div className="text-center justify-center items-center mt-3">
                    <span
                      className=" 
              font-[800]  text-black-100 font-courierPrime 
              xl:text-[24px]
              md:text-[28px]
              h-[20px] w-[140px] text-[18px]"
                    >
                      Payment Plan
                    </span>
                  </div>
                  <div className="mx-3 my-6 sm:text-left text-center xl:mx-8">
                    <h1
                      className="text-black-100 font-courierPrime 
                  text-[16px]
                  xl:text-[20px]"
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
                        <span className="ml-2 mt-1 font-courierPrime text-[14px]">
                          Monthly (1000 Credit in{" "}
                          {process.env.MONTHLY_PAYMENT_AMOUNT_1000_CREDIT}$)
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
                        <span className="ml-2 mt-1 font-courierPrime text-[14px]">
                          Monthly (2000 Credit in{" "}
                          {process.env.MONTHLY_PAYMENT_AMOUNT_2000_CREDIT}$)
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="mx-2 sm:mx-5 xl:mx-8">
                    <table className="table-auto mt-6 w-full">
                      <tbody>
                        <tr className="font-courierPrime text-[#44576D]">
                          <td className="py-4 md:text-[22px] lg:text-[24px] text-[15px]  md:py-3 font-extrabold ">
                            VAT (7.25%)
                          </td>
                          <td className=" text-end xms:text-[20px]  text-black-100 font-bold text-[14px]">
                            {VAT}
                          </td>
                        </tr>
                        <tr className="font-courierPrime text-[#44576D]">
                          <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold ">
                            Order Number
                          </td>
                          <td className="text-end xms:text-[20px]  text-black-100 font-bold text-[14px]">
                            {orderNo}
                          </td>
                        </tr>
                        <tr className="font-courierPrime text-[#44576D]">
                          <td className="py-4 md:text-[22px] lg:text-[24px]  text-[15px] md:py-3 font-extrabold  ">
                            Credits Purchased
                          </td>
                          <td className="text-end xms:text-[20px]  text-black-100 font-bold text-[14px]">
                            {selectedOption}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="border-b-2 border-dashed border-[#44576D] w-full xl:mt-[5rem] sm:[4rem] mt-[3rem] mb-5"></div>
                  </div>
                  <div className=" border-[#44576D] grid grid-cols-2 text-between mt-2 mx-6 xl:mx-8 mb-3 xl:pb-20 lg:pb-12 pb-8">
                    <div
                      className="text-[#44576D] col-span-1 font-courierPrime font-bold
                  text-start
                  text-[15px] mt-2
                  xms:text-[18px]
                  md:text-[24px]
                  slg:text-[22px]
                  xl:text-[22px] xl:mt-5"
                    >
                      Amount to be paid =
                    </div>
                    <div>
                      <div
                        className="font-courierPrime col-span-1 font-extrabold mt-5
                  text-black-100 
                  text-end
                  text-[16px]
                  xs:text-[18px] xs:mt-3
                  xms:text-[17px]
                  md:text-[24px]
                  slg:text-[25px]
                  xl:text-[40px]"
                      >
                        {toPay?.toString().split(".")[0]}.
                        <sub style={{ fontSize: "0.8em" }}>
                          {toPay?.toString().split(".")[1]?.substring(0, 2)??''}
                        </sub>{" "}
                        USD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Main>
  );
};

export default Payment;
