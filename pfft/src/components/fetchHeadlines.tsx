'use client'
import { FC, useState, useEffect } from "react";
import "animate.css/animate.min.css";
import NoHeadline from "./noHeadline";
import { useRouter } from "next/router";
import APICaller from "@/lib/API_Caller";
import showToast from "@/lib/toast";
import { APICallerOptions } from "@/models/APICaller.types";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
interface HeadlinesProps {
  headlines: string[];
  opinion: string;
  handleRePFFT: () => void;
  isFreeCredit: boolean;
}
const FetchHeadlines: FC<HeadlinesProps> = ({
  headlines,
  opinion,
  handleRePFFT,
}) => {
  const [headlines1, setHeadlines1] = useState<string[]>([]);
  const [headlines2, setHeadlines2] = useState<string[]>([]);
  const isMobile = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 640;
  }
  return false; // Default to false if window is not defined
  };
  const router = useRouter();
  const session = useSession().data;
  useEffect(() => {
    splitArrays();
  }, [headlines]);

  const splitArrays = (): void => {
    if (headlines && headlines.length !== 0) {
      const headlinesOne: string[] = [];
      const headlinesTwo: string[] = [];

      for (let i = 0; i < headlines.length; i++) {
        const headline = headlines[i];

        if (headline !== undefined) {
          if (i % 2 === 0) {
            headlinesOne.push(headline);
          } else {
            headlinesTwo.push(headline);
          }
        }
      }

      setHeadlines1(headlinesOne);
      setHeadlines2(headlinesTwo);
    }
  };

  const getUserPayment = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/getUserPayment?userID=${session?.user?._id}`,
      method: "GET",
    };

    try {
      return await APICaller(options);
    } catch (error) {
      console.error(error); // Handle the error
    }
  };

  const handleOnClick = (headline: string) => {
    if (!session) {
      router.push({
        pathname: "/article",
        query: {
          headline: headline,
          opinion: opinion,
        },
      });
      return;
    }

    getUserPayment().then((paymentInfo) => {
      if (paymentInfo.isFreeCredit) {
        if (paymentInfo?.credit > 0) {
          router.push({
            pathname: "/article",
            query: {
              headline: headline,
              opinion: opinion,
            },
          });
        } else {
          showToast("Please Subscribe to monthly plan.");
        }
      } else {
        if (paymentInfo?.credit > 0) {
          router.push({
            pathname: "/article",
            query: {
              headline: headline,
              opinion: opinion,
            },
          });
        } else {
          showToast(
            <div>
              <div>Oh no, you are out of free credits! But good news, you can give us money here!</div>
              <div className="flex justify-start mt-2">
                <button
                  onClick={() => {
                    router.push("/account");
                  }}
                  className="bg-gradient-red-1-to-red-2 text-white rounded-full px-4 py-2"
                >
                  My Account
                </button>
              </div>
            </div>
          );
        }
      }
    });
  };
  return (
    <>
      {headlines?.length === 0 ? (
        <NoHeadline />
      ) : (
        <div className="overflow-x-hidden grid grid-cols-1 gap-x-1 mx-3 lg:mt-8 font-copperplate lg:grid-cols-6 justify-end h-screen">
          <div className="text-[black] lg:order-1 ml-2 col-span-2 lg:px-0 px-8">
            <ToastContainer />
            {headlines1.map((headline, index) => {
              //const mobileFontSize = index === 0 ? 24 : 16; // smaller sizes for mobile
              const fontWeight = index === 0 ? 600 : 400;
              return (
                <div
                  onClick={() => {
                    handleOnClick(headline);
                  }}
                  style={{
                    fontSize: `${isMobile() ? (index === 0 ? 24 : 16) : (index === 0 ? 36 : 22)}px`,
                    fontWeight: `${fontWeight}`,
                    animationDuration: "1s",
                    animationDelay: "1s" // Adjust the delay as needed
                  }}
                  key={index + headline}
                >
                  <div className="cursor-pointer hover:bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl p-2 text-[black] animate__animated animate__backInLeft">
                    {headline}
                  </div>
                  <hr className="h-px my-8 border-0 bg-[#E6E6E6]" />
                </div>
              );
            })}
          </div>

          <div
            className="order-first flex flex-col items-center justify-center p-4 col-span-2
          text-[20px]
          xms:text-[22px]
          lg:text-[22px]
          lg:order-2"
          >
            <div
              className="text-center font-courierPrime mb-4
           "
            >
              Choose your pffts
            </div>
            <div className="text-center font-courierPrime mb-4">or</div>
            <button
              onClick={() => {
                handleRePFFT();
              }}
              className="lg:mt-5 mt-0 mb-6 lg:mb-0 rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200 w-[13rem] h-[3.8rem] font-courierPrime font-bold text-white"
            >
              re-pfft
            </button>
          </div>

          <div className="text-[black] lg:text-right lg:order-3 col-span-2 mx-3 lg:px-0 lg:ml-0 ml-2 px-8  ">
            {headlines2.map((headline, index) => {
              const fontSize = index === 0 ? 36 : 22;
              //const mobileFontSize = index === 0 ? '20px' : '12px'; // smaller sizes for mobile
              const fontWeight = index === 0 ? 600 : 400;
              return (
                <div
                  onClick={() => {
                    handleOnClick(headline);
                  }}
                  style={{
                    animationDuration: "1s",
                    animationDelay: "1s",
                    fontSize: `${fontSize}px`,
                    fontWeight: `${fontWeight}`
                  }}
                  key={index + headline}
                >
                  <div className="cursor-pointer hover:bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl p-2 text-[black] animate__animated animate__backInRight">
                    {headline}
                  </div>
                  <hr className="h-px my-8 border-0 bg-[#E6E6E6]" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default FetchHeadlines;
