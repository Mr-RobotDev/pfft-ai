"use client";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { useState } from "react";
import "animate.css/animate.min.css";
import { AnimationOnScroll } from "react-animation-on-scroll";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";
import { useSession } from "next-auth/react";
import showToast from "@/lib/toast";

const HomePage: FC = () => {
  const session = useSession().data;
  const [opinion, setOpinion] = useState("");
  const [error, setError] = useState("");
  const [user_id, setUser_id] = useState(session?.user?._id);
  const router = useRouter();

  const handleInputChange = (event: any) => {
    setOpinion(event.target.value);
    setError("");
  };
  useEffect(() => {
    setUser_id(session?.user?._id);
  }, [session?.user?._id]);

  const getUserPayment = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/getUserPayment?userID=${user_id}`,
      method: "GET",
    };

    try {
      return await APICaller(options);
    } catch (error) {
      console.error(error); // Handle the error
    }
  };

  const handlePFFT = async () => {
    if (!user_id) {
      let pffting = localStorage.pffting;
      if (pffting) pffting = JSON.parse(pffting);
      if (pffting && pffting.count >= 5) {
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
        router.push({
          pathname: "/headlines",
          query: { opinion, isFreeCredit: true },
        });
      }
    } else {
      getUserPayment().then((paymentInfo) => {
        if (paymentInfo?.isFreeCredit) {
          if (paymentInfo?.credit > 0) {
            router.push({
              pathname: "/headlines",
              query: { opinion, isFreeCredit: paymentInfo?.isFreeCredit },
            });
          } else {
            showToast("Please Subscribe to monthly plan.");
          }
        } else {
          if (paymentInfo?.credit > 0) {
            router.push({
              pathname: "/headlines",
              query: { opinion },
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
    }
  };
  return (
    <>
      <div className="overflow-x-hidden ">
        <Main
          meta={
            <Meta
              title="AI Comedy Tool: AI Humor Has Arrived | PFFT.AI"
              description="AI Comedy Tool: AI Humor Has Arrived | PFFT.AI"
            />
          }
        >
          <div className="md:mt-14 w-100 flex flex-col mt-0 lg:flex-row justify-around items-center text-[black] align-center ">
            <div className="w-1/2 grow-0">
              <div className="text-center items-center">
                <div className="font-courierPrime font-normal text-[50px]  md:text-[90px] lg:text-[120px] xl:text-[150px] leading-[68px] md:leading-[96px] lg:leading-[155px] xl:leading-[209px] animate__animated animate__zoomInDown">
                  ai
                </div>
                <div
                  className="
                      relative font-courierPrime font-normal
                      pb-10 md:pb-3 lg:pb-0
                      text-[50px] md:text-[90px] lg:text-[120px] xl:text-[150px] 
                      leading-[68px] md:leading-[130px] lg:leading-[155px] xl:leading-[209px] animate__animated animate__zoomInUp"
                >
                  comedy
                  <div
                    className="
                        text-right font-[400] font-courierPrime 
                        absolute
                        md:bottom-0
                        bottom-[8px] 
                        text-[16px] md:text-[24px]
                        leading-[50px] md:leading-[40px]
                        top-[70px] md:top-[120px] lg:top-[150px] xl:top-[170px]
                        right-[3px] 
                        xs:right-[40px]
                        xms:right-[50px]
                        sm:right-[100px]
                        md:right-[90px] 
                        lg:right-[85px]
                        xl:right-[110px]
                        2xl:right-[165px]
                        3xl:right-[240px]"
                  >
                    IS HERE
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/3 grow-0 ">
              <span className="flex flex-col items-center md:mt-10 animate__animated animate__zoomInUp">
                <input
                  type="text"
                  placeholder="ENTER AN OPINION"
                  value={opinion}
                  onChange={handleInputChange}
                  className={`rounded-full bg-gray-300 h-[45px] placeholder-[black] font-copperplate font-normal focus:outline-orange-400 focus-ring-1 py-3 px-5 leading-[17px] w-[100%] text-[13px] xs:text-[16px] md:text-[20px] md:leading-[26.38px] md:px-10 md:py-4 md:h-[70px] lg:h-[100px] lg:w-[90%] lg:text-[24px]`}
                />
                {error && (
                  <div className="text-orange-500 font-courierPrime">
                    {error}
                  </div>
                )}
                <button
                  type="button"
                  disabled={opinion === ""}
                  onClick={handlePFFT}
                  className="animate__animated animate__zoomInUp rounded-full px-1 mt-6 bg-gradient-red-1-to-red-2 text-[white] font-[400] font-copperplate text-[20px] py-3 leading-[26px] w-[130px] md:mt-8 md:py-3 md:w-[153px] md:text-[25px]  md:leading-[35px] lg:mt-12 lg:py-3 lg:w-[153px] lg:text-[35px]  lg:leading-[42px]"
                >
                  PFFT
                </button>
              </span>
            </div>
          </div>

          <div className="mt-40 md:mt-40 sm:mt-30 bg-scroll bg-no-repeat bg-cover bg-[url('/assets/images/home-bg.svg')] w-full">
            <div className="flex flex-col font-courierPrime justify-center items-center">
              <div
                className="w-full sm:mt-[6rem] sm:mb-[2rem] xs:mt-16 mt-12 xs:mb-0 md:mt-28 xl:mt-40 text-center font-bold  md:text-[42px] text-[red] text-[28px] xl:text-6xl ml-5 sm:ml-0 
                      sm:text-[37px] "
              >
                AI Comedy Tips
              </div>
              <div className="w-11/12 mt-5 mb-12 flex justify-around xl:items-center items-center lg:items-stretch flex-col lg:flex-col xl:flex-row">
                <div className="w-full  grow-0">
                  <AnimationOnScroll animateIn="animate__fadeInLeft overflow-hidden">
                    <div className="w-100 flex items-center">
                      <div
                        className="
                          relative 
                          w-[60px] h-[60px] shrink-0 rounded-full bg-[#F99B7D] bg-opacity-[21%]
                          sm:w-[80px] sm:h-[80px] 
                          md:w-[110px] md:h-[110px] 
                          lg:w-[147px] lg:h-[147px]"
                      >
                        {/* <span> <h1 className="font-bold text-center text-black "> Experiment with Detail </h1> </span> */}
                        <img
                          className="
                            absolute inset-0 object-cover rounded-full m-auto
                            w-[40px] h-[40px]
                            sm:w-[60px] sm:h-[60px] 
                            md:w-[90px] md:h-[90px] 
                            lg:w-[100px] lg:h-[100px]"
                          src="/assets/images/plane.svg"
                          alt="Image"
                        />
                      </div>

                      <div
                        className="
                          font-courierPrime font-normal text-[black]
                          text-[14px] leading-[18px] px-5
                          sm:text-[16px] sm:leading-[22px] sm:px-6
                          md:text-[18px] md:leading-[24px] md:px-6
                          lg:text-[20px] lg:leading-[26px] lg:px-7
                          xl:text-[22px] xl:leading-[28px] xl:px-8
                          2xl:text-[23px] 2xl:leading-[29px] 2xl:px-9
                          3xl:text-24 3xl:leading-[30px] 3xl:px-10"
                      >
                        <h1 className="font-bold text-[16px] mb-2 md:text-[24px]">
                          {" "}
                          Experiment with Detail{" "}
                        </h1>
                        Our AI comedy tool will work differently depending on
                        how much detail you provide it. Experiment with giving
                        it a lot more (or less) detail about your opinion.{" "}
                        <br></br>
                        <br></br>
                        <div className="mx-4">
                          {" "}
                          For example you could try: “people do such stupid
                          things” OR try a detailed example of your opinion:
                          “people will believe anything they see on social
                          media, and react with outrage without doing any
                          research first to see it it is true.”
                        </div>
                        <br></br> Sometimes the more detailed answer will work
                        better for an AI joke, sometimes the less detailed
                        example will work better.
                      </div>
                    </div>
                  </AnimationOnScroll>
                  <AnimationOnScroll animateIn="animate__fadeInLeft">
                    <div className="mt-8 w-100 flex items-center">
                      <div
                        className="
                          relative 
                          w-[60px] h-[60px] shrink-0 rounded-full bg-[#F99B7D] bg-opacity-[21%]
                          sm:w-[80px] sm:h-[80px] 
                          md:w-[110px] md:h-[110px] 
                          lg:w-[147px] lg:h-[147px]"
                      >
                        <img
                          className="
                            absolute inset-0 object-cover rounded-full m-auto
                            w-[40px] h-[40px]
                            sm:w-[60px] sm:h-[60px] 
                            md:w-[90px] md:h-[90px] 
                            lg:w-[100px] lg:h-[100px] "
                          src="/assets/images/globe.svg"
                          alt="Image"
                        />
                      </div>

                      <div
                        className="mt-5 
                          font-courierPrime font-normal text-[black]
                          text-[14px] leading-[18px] px-5
                          sm:text-[16px] sm:leading-[22px] sm:px-6
                          md:text-[18px] md:leading-[24px] md:px-6
                          lg:text-[20px] lg:leading-[26px] lg:px-7
                          xl:text-[22px] xl:leading-[28px] xl:px-8
                          2xl:text-[23px] 2xl:leading-[29px] 2xl:px-9
                          3xl:text-24 3xl:leading-[30px] 3xl:px-10"
                      >
                        <h1 className="font-bold text-[16px] mb-2 md:text-[24px]">
                          {" "}
                          Indicate current events by saying, “currently”{" "}
                        </h1>
                        Our AI comedy tool uses Large Language Models that don’t
                        have access to current events. Using “currently”, then
                        telling the model what’s new in the last few years, can
                        help it understand what has changed since it was
                        trained.
                        <br></br>
                        <br></br>
                        <div className="mx-4">
                          For example: try, “Russia, who is currently at war
                          with Ukraine, has a weak and pathetic Army”
                        </div>
                        <br></br>{" "}
                      </div>
                    </div>
                  </AnimationOnScroll>
                  <AnimationOnScroll animateIn="animate__fadeInLeft">
                    <div className="mt-8  w-100 flex items-center">
                      <div
                        className="
                          relative 
                          w-[60px] h-[60px] shrink-0 rounded-full bg-[#F99B7D] bg-opacity-[21%]
                          sm:w-[80px] sm:h-[80px] 
                          md:w-[110px] md:h-[110px] 
                          lg:w-[147px] lg:h-[147px]"
                      >
                        <img
                          className="
                            absolute inset-0 object-cover rounded-full m-auto
                            w-[40px] h-[40px]
                            sm:w-[60px] sm:h-[60px] 
                            md:w-[90px] md:h-[90px] 
                            lg:w-[100px] lg:h-[100px]"
                          src="/assets/images/bulb.svg"
                          alt="Image"
                        />
                      </div>

                      <div
                        className=" mb-4
                          font-courierPrime font-normal text-[black]
                          text-[14px] leading-[18px] px-5
                          sm:text-[16px] sm:leading-[22px] sm:px-6
                          md:text-[18px] md:leading-[24px] md:px-6
                          lg:text-[20px] lg:leading-[26px] lg:px-7
                          xl:text-[22px] xl:leading-[28px] xl:px-8
                          2xl:text-[23px] 2xl:leading-[29px] 2xl:px-9
                          3xl:text-24 3xl:leading-[30px] 3xl:px-10"
                      >
                        <h1 className="font-bold text-[16px] mb-2 md:text-[24px]">
                          {" "}
                          Don’t give up{" "}
                        </h1>
                        Some of the greatest comedians find only 1/20 of their
                        comedy ideas are actually funny. We think our AI comedy
                        tool is even better than that, but some prompts will be
                        less. Experiment with different prompts and try a few
                        generations before you give up. This is just a tool, you
                        are the ultimate judge of what is funny or not. Use your
                        comedy insticts… sometimes the second time you read
                        something you’ll realize it was funny after all.
                      </div>
                    </div>
                  </AnimationOnScroll>
                </div>

                <div className="w-full mt:0 md:mt-10 xl:mt-0 xl:w-1/2 shrink-0 flex justify-center ">
                  <AnimationOnScroll animateIn="animate__zoomIn">
                    <img
                      className="
                            w-[200px] h-[300px]
                            xs:w-[250px] xs:h-[350px]
                            sm:w-[300px] sm:h-[400px]
                            md:w-[400px] md:h-[500px]
                            lg:w-[500px] lg:h-[600px]
                            "
                      src="/assets/images/our-values-girl.svg"
                      alt="Image"
                    />
                  </AnimationOnScroll>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:mt-16 mt-8">
            <AnimationOnScroll animateIn="animate__fadeInRight">
              <div className="flex flex-row">
                <AnimationOnScroll animateIn="animate__zoomInUp">
                  <div>
                    {/* <img
                  className="hidden lg:block object-cover h-[300px] md:h-[500px]"
                  src="/assets/images/lady-laptop.svg"
                  alt="Image"
                /> */}
                  </div>
                </AnimationOnScroll>

                <img
                  className="hidden lg:block object-cover h-[300px] md:h-[500px]"
                  src="/assets/images/lady-laptop.svg"
                  alt="Image"
                />

                <span className="mx-5 md:mx-20 flex-col text-center md:text-left lg:mt-[3.5rem] xl:mt-[4rem] 2xl:mt-[8rem]">
                  <div
                    className="
                      w-full font-bold text-[red] font-courierPrime
                      text-[22px]
                      sm:text-[37px] 
                      md:text-[42px]
                      lg:text-5xl
                      xl:text-6xl"
                  >
                    How Our AI Comedy Tool Works
                  </div>
                  <div
                    className="
                      md:px-1 md:py-2  md:mt-2
                      whitespace-normal text-[black] md:text-left text-center overflow-hidden font-courierPrime font-normal 
                      text-[16px] leading-[22px]
                      sm:text-[19px] sm:leading-[24px]
                      md:text-[22px] md:leading-[26px]
                      lg:text-[25px] lg:leading-[29px]
                      xl:text-[28px] xl:leading-[32px]
                      2xl:text-[32px] 2xl:leading-[36px]"
                  >
                    Our AI comedy tool uses Large Language Models which have
                    been trained on things that make humans go PFFT. We will
                    continue to train it to be funnier and funnier until humans
                    are destroyed by severely traumatic gut injuries from
                    explosive belly-laughs. That was a joke… and not even an AI
                    joke!
                  </div>
                </span>
              </div>
            </AnimationOnScroll>
          </div>
          <div>
            <div className="bg-no-repeat xl:mt-[5rem] md:mt-[2rem] mt-[4rem] xl:mb-4 md:mb-2 xl:py-5 bg-cover bg-[#FFC1A3]  h-full rounded-t-[7rem] w-full md:h-fit overflow-hidden">
              <AnimationOnScroll animateIn="animate__fadeInUp">
                <div className=" row-span-1 xl:mx-12 ml-[2.25rem]">
                  <div
                    className="w-[85%] md:w-full md:px-7 md:my-4 pt-7 text-center font-bold  md:text-4xl text-[red] text-[20px]
                 sm:text-[37px]  font-courierPrime xl:text-6xl mt-4 sm:mt-0"
                  >
                    AI Comedy Tool for Humans by Humans
                  </div>
                </div>
              </AnimationOnScroll>
              <AnimationOnScroll animateIn="animate__fadeInLeft">
                <div className="mx-4 text-center row-span-1 ">
                  <div className="grid xl:grid-cols-3 grid-rows-1 justify-center xl:mx-9 mb-4 ">
                    <div
                      className="md:mx-8 md:py-2 md:pt-2 xl:mt-[5.5rem] mt-3 md:col-span-2  flex justify-between row-span-1
                      whitespace-normal text-[black] overflow-hidden font-courierPrime font-normal 
                      text-[16px] leading-[22px]
                      sm:text-[19px] sm:leading-[24px]
                      md:text-[22px] md:leading-[26px]
                      lg:text-[25px] lg:leading-[29px]
                      xl:text-[28px] xl:leading-[32px]
                      2xl:text-[32px] 2xl:leading-[36px]"
                    >
                      Our AI comedy tool wasn’t created to replace human
                      comedians, it was created to make their lives easier, and
                      to give us all more laughs. As professional comedians
                      realize, real comedy writing can actually be very
                      difficult, and often not fun at all. We think this is a
                      tragedy, and we want to help. We don’t even care about
                      making money, as long as we can make money in the process!
                    </div>
                    <div
                      className="md:col-span-1 flex xl:justify-end justify-center w-fit
                      row-span-1 md:ml-[13.5rem] md:-mr-[2.5rem] lg:ml-[22.5rem] lg:mt-7 xl:ml-0 xl:mr-0 slg:ml-[18.5rem] slg:mt-7 sm:mx-[5rem] "
                    >
                      <img
                        className="flex justify-center xs:ml-[2rem]"
                        src="/assets/images/last-content-img.svg"
                        alt="image"
                        width="500"
                        height="500"
                      />
                    </div>
                  </div>
                </div>
              </AnimationOnScroll>
            </div>
          </div>
        </Main>
      </div>
    </>
  );
};

export default HomePage;
