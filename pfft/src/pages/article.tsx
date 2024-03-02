'use client'
import React, { FC, useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";
import { useSession } from "next-auth/react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import showToast from "@/lib/toast";
import { ToastContainer } from "react-toastify";
import { createShortUrl } from "@/utils/helper";

const ArticleGenerated: FC = () => {
  const router = useRouter();
  const headline = router.query.headline as string;
  const opinion = router.query.opinion as string;
  const [segments, setSegments] = useState<string[]>([]);
  const [article, setArticle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [blogID, setBlogID] = useState(null);
  const [shareURL, setShareURL] = useState("");
  const [showShareIcons, setShowShareIcons] = useState(false);
  const session = useSession().data;
  const status = useSession().status

  const handleShareClick = () => {
    setShowShareIcons(!showShareIcons);
  };

  useEffect(() => {
    if(status === "loading" ) return
    generateArticle();
  }, [session?.user?._id]);

  const deductAmount = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/amountDeduction?userID=${session?.user?._id}`,
      method: "GET",
    };

    try {
      return await APICaller(options);
    } catch (error) {
      console.error(error); // Handle the error
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

  const generateArticle = async () => {
    const user_id = session?.user?._id ?? JSON.parse(localStorage.pffting).id;
    setArticle("");
    setBlogID(null);
    setLoading(true);
    const requestBody = {
      opinion: opinion,
      headline: headline,
    };
    const options: APICallerOptions = {
      body: requestBody,
      URL: `/api/generateArticle?headline=${headline}&userID=${user_id}&opinion=${opinion}`,
      method: "POST",
    };
    try {
      const result = await APICaller(options);
      if (result?.error) {
        setArticle("No article found");
        setLoading(false);
      } else {
        setArticle(result?.article.article);
        setBlogID(result?.blog_id);

        await createShortUrl(
          `${process.env.NEXTAUTH_URL}blog?blogID=${
            result?.blog_id as unknown as string
          }`
        ).then((url) => {
          setShareURL(url);
        });
        if (session) {
          deductAmount();
        }
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const updatedSegments = article
      ?.split("<br><br>")
      .flatMap((segment) => segment?.split("<br>"));
    setSegments(updatedSegments);
  }, [article]);
  return (
    <>
      <Main meta={<Meta title="Article" description="Article" />}>
        <ToastContainer />
        <div
          className=" grid-cols-5 gap-3 
        overflow-x-hidden
        lg:grid
        slg:flex slg:flex-col
        flex flex-col
        "
        >
          {/* Buttons for re-article and new pfft */}
          <div
            className="col-span-1 flex flex-col  items-center 
          xl:order-first xl:h-screen xl:justify-center 
          lg:order-first lg:h-screen lg:justify-center lg:flex-col
          slg:order-2  slg:justify-center slg:flex-row
          md:flex-row md:justify-center
          order-2 justify-end 
          "
          >
            <button
              onClick={async () => {
                if (!session) {
                  const res = await fetch("https://api.ipify.org?format=json");
                  const { ip } = await res.json();
                  let pffting = localStorage.pffting;
                  if (pffting) pffting = JSON.parse(pffting);
                  if (!pffting) {
                    localStorage.setItem(
                      "pffting",
                      JSON.stringify({ ip, count: 1 })
                    );
                    generateArticle();
                  } else if (pffting.count >= 5) {
                    showToast(
                      <div>
                        <div>Create an account to continue for free.</div>
                        <div className="flex justify-start mt-2">
                          <button
                            onClick={() => {
                              router.push("/signup");
                            }}
                            className="bg-gradient-red-1-to-red-2 text-white rounded-full px-4 py-2"
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    localStorage.setItem(
                      "pffting",
                      JSON.stringify({ ...pffting, count: pffting.count + 1 })
                    );
                    generateArticle();
                  }
                  return;
                }
                getUserPayment().then((paymentInfo) => {
                  if (paymentInfo.isFreeCredit) {
                    if (paymentInfo?.credit > 0) {
                      generateArticle();
                    } else {
                      showToast("Please Subscribe to monthly plan.");
                    }
                  } else {
                    if (paymentInfo?.credit > 0) {
                      generateArticle();
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
              }}
              className="rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200
              2xl:w-[267px] 2xl:h-[106px] 2xl:mb-[3rem]  2xl:text-[32px]
              xl:w-[180px] xl:h-[100px] xl:mb-[3rem]  xl:text-[28px]
              lg:w-[150px] lg:h-[90px] lg:mb-[3rem] lg:text-[24px] lg:font-normal lg:mr-[0rem]
              md:w-[210px] md:h-[100px] md:text-[32px] md:mr-3 md:mb-0
              xs:w-[190px] xs:h-[56px]  xs:text-[20px]
              slg:pr-0 slg:mr-2
              w-[190px] h-[56px]  mb-[1rem] text-[20px]
              text-slate-50 font-courierPrime  hover:bg-orange-300 font-light"
            >
              re-article
            </button>
            <button
              onClick={() => {
                router.push({
                  pathname: "/",
                });
              }}
              className="rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200
              2xl:w-[267px] 2xl:h-[106px] 2xl:mb-[3rem]  2xl:text-[32px]
              xl:w-[180px] xl:h-[100px] xl:mb-[3rem]  xl:text-[28px] 
              lg:w-[150px] lg:h-[90px] lg:mb-[3rem] lg:text-[24px] lg:font-normal lg:ml-[0rem]
              md:w-[210px] md:h-[100px] md:text-[32px] 
              xs:w-[190px] xs:h-[56px]  xs:text-[20px]
              w-[190px] h-[56px] text-[20px]
              text-slate-50 font-courierPrime  hover:bg-orange-300 font-light"
            >
              new pfft
            </button>
          </div>

          {/* Article Generated */}
          <div
            className="col-span-5 md:col-span-3 lg:col-span-3
          lg:text-left lg:px-4
          xl:px-[10rem]
          slg:px-[10rem] slg:pb-5 slg:text-left
          md:px-8 md:pb-7 md:pt-3 md:text-left
          xms:px-5 xms:pb-5 xms:text-center
          xs:px-5 xs:pb-5 xs:text-center
          text-center px-4"
          >
            <h1 className="article-header font-bold font-copperplate mb-6 text-black-100">
              {headline}
            </h1>
            <div className="md:flex-row items-center sm:flex flex-row text-center ">
              <div className="border-b-[3px] border-[#D7D7D7] w-100 xxs:pb-6 sm:flex sm:flex-row text-center flex-row pb-2 ">
                <h2 className="text-lg font-courierPrime text-[#44576D] pt-2">
                  by AI {session?.user?.name}
                </h2>
                <div className="grid justify-center">
                  <div
                    className="bg-gradient-to-r from-orange-100 to-orange-200 hover:bg-orange-100  w-fit 
                      text-white text-center my-3 sm:my-0 sm:mx-3
                      text-sm rounded-full font-copperplate py-2 px-4"
                  >
                    @PFFT.AI
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <PulseLoader color="orange" size={20} />
              </div>
            ) : (
              <div className="font-courierPrime mt-10 text-[22px]">
                {segments?.map((segment, index) => {
                  return (
                    <div key={index} className="mb-2 article-container" dangerouslySetInnerHTML={{
                      __html: segment
                    }} />
                  );
                })}
              </div>
            )}
          </div>
          {/* Button for share */}
          <div
            className="col-span-1 flex flex-col  items-center 
          xl:order-3 xl:h-screen xl:justify-center 
          lg:order-3 lg:h-screen lg:justify-center
          slg:order-2  slg:justify-start 
          order-2  justify-end mb-10" 
          >
            <div className="relative" style={{ minHeight: "100px" }}>
              {(
                <button
                  className="rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200 mb-7
                2xl:w-[267px] 2xl:h-[106px]  2xl:text-[32px]
                xl:w-[180px] xl:h-[100px]  xl:text-[30px]
                lg:w-[150px] lg:h-[90px] lg:mb-[1rem] lg:text-[24px] lg:font-normal
                md:w-[210px] md:h-[100px] md:text-[32px] md:mt-[0.5rem]
                xs:w-[190px] xs:h-[56px]  xs:text-[20px]
                w-[190px] h-[56px] text-[20px]
                 text-slate-50 font-courierPrime"
                  disabled={blogID === null}
                  onClick={handleShareClick}
                >
                  Share
                </button>
              )}
              {showShareIcons && blogID && (
                <div className="border-2 border-[#FF4738] bg-white rounded-2xl shadow-lg w-full">
                  <ul className="flex justify-around">
                    <FacebookShareButton url={shareURL} hashtag={"#pfft"}>
                      <img
                        className="inset-0 object-cover w-[40px] h-[40px]
                        md:w-[30px] md:h-[30px]
                        xl:w-[40px] xl:h-[40px]  "
                        src="/assets/images/facebook.png"
                        alt="Facebook"
                      />
                    </FacebookShareButton>

                    <TwitterShareButton
                      url={shareURL}
                      title={headline}
                      via={session?.user?.name as string}
                    >
                      <img
                        className="inset-0 object-cover w-[40px] h-[40px]
                        md:w-[30px] md:h-[30px]
                        xl:w-[40px] xl:h-[40px] "
                        src="/assets/images/twitter.png"
                        alt="Twitter"
                      />
                    </TwitterShareButton>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </Main>
    </>
  );
};

export default ArticleGenerated;
