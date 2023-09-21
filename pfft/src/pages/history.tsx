'use client'
import React, { FC, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import Accordion from "@/components/accordian";
import { useSession } from "next-auth/react";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";
import PulseLoader from "react-spinners/PulseLoader";
import "animate.css/animate.min.css";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { createShortUrl } from "@/utils/helper";

interface AccordionItem {
  headline: string;
  _id: string;
  article: string;
  userId: string;
}

const HistoryPage: FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [accordionItems, setAccordionItems] = useState<AccordionItem[]>([]);
  const session = useSession().data;
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [showShareIcons, setShowShareIcons] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [article, setArticle] = useState<string>("");
  const [blogID, setBlogID] = useState<string>("");
  const [userId, setUserId] = useState<string>(session?.user?._id || "");
  const [history, setHistory] = useState<string[]>([]);
  const [userPayment, setUserPayment] = useState<any>();
  const [isSubscriptionValid, setIsSubscriptionValid] =
    useState<boolean>(false);
  const [shareURL, setShareURL] = useState("");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setUserId(session?.user?._id);
  });

  useEffect(() => {
    if (userId) getHistory();
  }, [userId]);

  const getHistory = async () => {
    setLoading(true);
    const options: APICallerOptions = {
      body: {},
      URL: `/api/getHistory?userID=${userId}`,
      method: "GET",
    };
    try {
      const result: any = (await APICaller(options)) as {
        history: { _id: string; article: string }[];
      };
      setHistory(result.history);
      setAccordionItems(result.history);

      if (result.history.length === 0) {
        setSelectedCard(""); // Clear the selected card
        setArticle("");
      } else {
        setSelectedCard(result.history[0]._id);
        setBlogID(result.history[0]._id);
        setArticle(result.history[0].article);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCardClick = (_id: string, article: string) => {
    setSelectedCard(_id === selectedCard ? "" : _id);
    setArticle(article);
    setBlogID(_id);
  };

  const handleShareClick = async () => {
    await createShortUrl(
      `${process.env.NEXTAUTH_URL}blog?blogID=${blogID as string}`
    ).then((url) => {
      setShareURL(url);
    });
    setShowShareIcons(!showShareIcons);
  };
  useEffect(() => {
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
    if (session?.user?._id) getUserPayment();
  }, [session?.user?._id]);

  useEffect(() => {
    const checkSubscription = async () => {
      setLoading(true);
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
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    if (session?.user?._id) checkSubscription();
  }, [userPayment]);

  return (
    <>
      <Main meta={<Meta title="History" description="History" />}>
        {/* Small Screen less than 768px */}
        {loading ? (
          <div className="justify-center flex items-center visible md:hidden">
            <PulseLoader color="#FF854A" size={20} />
          </div>
        ) : (
          <>
            {history?.length > 0 ? (
              <div className="justify-center p-2 visible md:hidden overflow-auto w-full">
                <div
                  className="
                           grid justify-center
                           "
                >
                  <div onClick={toggleDropdown} className="flex justify-center">
                    <img
                      className={`object-cover rounded-full cursor-pointer justify-center
                              w-[40px] h-[40px]
                              sm:w-[50px] sm:h-[50px]
                              slg:w-[40px] slg:h-[40px]
                              xl:w-[60px] xl:h-[60px]
                              ${isOpen ? "" : ""}`}
                      src="/assets/images/menu_icon.svg"
                      alt="Image"
                    />
                  </div>

                  {isOpen && (
                    <div
                      className="w-fit mt-[1.5rem]border-[#FF4738] 
                            lg:-mt-[1rem]
                            slg:w-fit slg:-mt-[1rem] 
                            xl:w-[150px]"
                    >
                      <ul>
                        <li
                          onClick={() => {
                            router.push("/");
                          }}
                          className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                          slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                          xl:py-4 xl:text-[20px] xl:px-0
                                  "
                        >
                          PFFT
                        </li>
                        {!isSubscriptionValid && (
                          <li
                            onClick={() => {
                              router.push("/payment");
                            }}
                            className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                          slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                          xl:py-4 xl:text-[20px] xl:px-0
                                  "
                          >
                            Payment
                          </li>
                        )}
                        <li
                          className="cursor-pointer border-[2px] border-[#FF3633] font-bold  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                          slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                          xl:py-4 xl:text-[20px] xl:px-0
                                  "
                        >
                          History
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <div className="justify-center items-center md:invisible">
                  {accordionItems?.length > 0 && (
                    <Accordion items={accordionItems} />
                  )}
                </div>
              </div>
            ) : (
              <div className="visible md:hidden overflow-auto w-full">
                <div className="flex flex-col items-center justify-center content-center mt-40 md:mt-20">
                  <img
                    className="
                            object-cover 
                            w-[200px] h-[130px]
                            xs:w-[220px] xs:h-[150px]
                            xms:w-[230px] xms:h-[150px]
                            sm:w-[250px] sm:h-[170px] 
                            md:w-[350px] md:h-[252px] 
                            lg:w-[580px] lg:h-[390px]
                            xl:w-[750px] xl:h-[530px] 
                            "
                    src="/assets/images/blocked_words.svg"
                    alt="Image"
                  />
                  <div
                    className="
                              my-12 mx-12 text-center
                              text-[7px]
                              xs:text-[10px]
                              xms:text-[11px]
                              sm:text-[15px]
                              md:text-[20px]
                              lg:text-[25px]
                              xl:text-[35px]
                              cursor-pointer leading-[40px] font-courierPrime "
                  >
                    <span className="font-[400] text-[black]">
                      {"Oops! Looks like there's no history available. "}
                    </span>
                    <span
                      className="text-[#FF3031]"
                      onClick={() => {
                        router.push("/");
                      }}
                    >
                      pfft
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Large Screen more than 768px */}
        <div className="hidden md:block">
          <div className="flex flex-col min-h-screen ">
            <main className="flex-grow animate__animated animate__backInDown">
              {loading ? (
                <div className="justify-center flex items-center visible md:hidden">
                  <PulseLoader color="#FF854A" size={20} />
                </div>
              ) : (
                <>
                  {history?.length > 0 ? (
                    <div className="grid  md:grid-cols-6 lg:grid-cols-8 gap-2 display-flex">
                      <div
                        className="md:col-span-2
                        lg:col-span-2 bg-transparent mt-5 border-r-2 border-[#CBCBCB] pr-3"
                      >
                        {/* History Cards */}
                        <div className="pl-2 text-[#302E41] w-full">
                          {history?.map((data: any, index) => {
                            return (
                              <button disabled={selectedCard === data?._id}>
                                <div
                                  key={data._id + index}
                                  className={`text-center bg-white shadow-sm rounded-2xl p-2 text-sm border font-courierPrime  ${
                                    selectedCard === data?._id
                                      ? "border-[#e86b34]  font-bold border-4 animate_flipInX animate_animated"
                                      : "border-gray-300"
                                  } cursor-pointer mb-5`}
                                  onClick={() => {
                                    if (selectedCard !== data?._id) {
                                      handleCardClick(
                                        data?._id ?? "",
                                        data?.article
                                      );
                                    }
                                  }}
                                >
                                  <h2 className="text-sm md:text-xs lg:text-lg md:p-1 font-bold">
                                    {selectedCard === data?._id
                                      ? data.headline
                                      : data.headline}
                                  </h2>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="lg:col-span-4 md:col-span-3 bg-white">
                        {/* Article */}
                        <div
                          className={`p-4 ${
                            selectedCard
                              ? "animate_animated animate_fadeInUp"
                              : ""
                          }`}
                        >
                          <h2 className="text-3xl text-[black] font-bold font-copperplate mb-8">
                            {selectedCard &&
                              accordionItems.find(
                                (item) => item._id === selectedCard
                              )?.headline}
                          </h2>
                          {selectedCard && (
                            <>
                              <div className="flex flex-row items-center">
                                <h1 className="text-lg font-courierPrime text-[#44576D] pr-5">
                                  By AI {session?.user?.name}
                                </h1>
                                <p
                                  className="bg-gradient-to-r from-orange-100 to-orange-200 hover:bg-orange-100 
                      text-white 
                         text-sm rounded-full font-copperplate py-2 px-4"
                                >
                                  @PFFT.AI
                                </p>
                              </div>
                              <div className="h-[1px] lg:w-2/5 xl:w-[25%] bg-gray-400 rounded-xl  w-full mt-[0.55rem]"></div>
                              <div className="mt-4">
                                <div className="mb-4 text-[#424242] font-courierPrime text-[22px]">
                                  {article.split("<br>").map((line, index) => {
                                    return (
                                      <React.Fragment key={line + index}>
                                        {line}
                                        <br />
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className=" lg:col-span-2 flex flex-col justify-start items-end space-between px-4 md:col-span-1 h-fit ">
                        {/* Menu */}
                        <div className="grid grid-rows-3 mx-5 overflow-hidden gap-6 justify-between">
                          <div className="grid justify-end row-span-1 relative h-fit">
                            <div
                              onClick={toggleDropdown}
                              className="flex justify-end"
                            >
                              <img
                                className="cursor-pointer flex justify-end w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] slg:w-[40px] slg:h-[40px] xl:w-[60px] xl:h-[60px]"
                                src="/assets/images/menu_icon.svg"
                                alt="Image"
                              />
                            </div>

                            <div
                              className={`${
                                isOpen ? "" : "invisible"
                              } mt-[1.5rem] border-[#FF4738] lg:mt-[1rem] slg:w-fit slg:mt-[1rem] xl:w-[150px]`}
                            >
                              <ul>
                                <li
                                  onClick={() => {
                                    router.push("/");
                                  }}
                                  className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                                  slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                                  xl:py-4 xl:text-[20px] xl:px-0"
                                >
                                  PFFT
                                </li>
                                {!isSubscriptionValid && (
                                  <li
                                    onClick={() => {
                                      router.push("/payment");
                                    }}
                                    className="cursor-pointer border-[2px] border-[#FF3633] font-[400]  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                                  slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                                  xl:py-4 xl:text-[20px] xl:px-0"
                                  >
                                    Payment
                                  </li>
                                )}
                                <li
                                  className="cursor-pointer border-[2px] border-[#FF3633]  text-[black] text-[14px]  bg-[#FDDDD2] py-2
                                  slg:text-[16px] slg:py-3  font-courierPrime px-5 text-center
                                  xl:py-4 xl:text-[20px] xl:px-0 font-bold"
                                >
                                  History
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="relative justify-center top-15 ">
                            <div
                              className="relative justify-center"
                              style={{ minHeight: "100px" }}
                            >
                              <button
                                className="rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200 
                                2xl:w-[267px] 2xl:h-[106px]  2xl:text-[32px]
                                xl:w-[180px] xl:h-[100px]  xl:text-[30px]
                                lg:w-[150px] lg:h-[90px] lg:mb-[1rem] lg:text-[24px] lg:font-normal
                                slg:w-[120px] slg:h-[80px] slg:mb-[1rem] slg:text-[20px] slg:font-normal
                                md:w-[120px] md:h-[80px] md:mb-[1rem] md:text-[20px] md:font-normal
                                 xs:w-[190px] xs:h-[56px]  xs:text-[20px]
                                 w-[190px] h-[56px] text-[20px]
                                text-slate-50 font-courierPrime"
                                onClick={() => {
                                  handleShareClick();
                                }}
                              >
                                Share
                              </button>
                              {showShareIcons && (
                                <div className="w-full absolute  border-2 border-[#FF4738] bg-white rounded-2xl shadow-lg ">
                                  <ul className="flex justify-around mx-2">
                                    {/* <li className="">
                                      <img
                                        className="inset-0 object-cover w-[40px] h-[40px] 
                                        md:w-[30px] md:h-[30px]
                                        xl:w-[40px] xl:h-[40px]  "
                                        src="/assets/images/insta.png"
                                        alt="Instagram"
                                      />
                                    </li> */}
                                    <FacebookShareButton
                                      url={shareURL}
                                      hashtag={"#pfft"}
                                    >
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
                                      title={
                                        selectedCard &&
                                        accordionItems.find(
                                          (item) => item._id === selectedCard
                                        )?.headline
                                      }
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
                                  {/* <ul className="flex justify-center">
                                    <li className="">
                                      <img
                                        className="inset-0 object-cover w-[60px] h-[60px] 
                                        md:w-[47px] md:h-[47px]
                                        xl:w-[60px] xl:h-[60px]"
                                        src="/assets/images/yahoo.png"
                                        alt="Yahoo"
                                      />
                                    </li>
                                  </ul> */}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center content-center mt-40 md:mt-20">
                        <img
                          className="
                          object-cover 
                          w-[200px] h-[130px]
                          xs:w-[220px] xs:h-[150px]
                          xms:w-[230px] xms:h-[150px]
                          sm:w-[250px] sm:h-[170px] 
                          md:w-[350px] md:h-[252px] 
                          lg:w-[580px] lg:h-[390px]
                          xl:w-[750px] xl:h-[530px] 
                          animate__animated animate__bounce"
                          src="/assets/images/blocked_words.svg"
                          alt="Image"
                        />
                        <div
                          className="
                            my-12 mx-12 text-center
                            text-[7px]
                            xs:text-[10px]
                            xms:text-[11px]
                            sm:text-[15px]
                            md:text-[20px]
                            lg:text-[25px]
                            xl:text-[35px]
                            cursor-pointer leading-[40px] font-courierPrime "
                        >
                          <span className="font-[400] text-[black]">
                            {"Oops! Looks like there's no history available. "}
                          </span>
                          <span
                            className="text-[#FF3031]"
                            onClick={() => {
                              router.push("/");
                            }}
                          >
                            pfft
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </Main>
    </>
  );
};

export default HistoryPage;
