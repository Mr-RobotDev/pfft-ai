'use client'
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { createShortUrl } from "@/utils/helper";

interface AccordionProps {
  items: AccordionItemProps[];
}

interface AccordionItemProps {
  _id: string;
  headline: string;
  article: string;
  userId: string;
}
const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showShareIcons, setShowShareIcons] = useState(false);
  const session = useSession().data;
  const [shareURL, setShareURL] = useState("");
  const [blogID, setBlogID] = useState<string>("");

  const handleShareClick = () => {
    getURL(blogID);
    setShowShareIcons(!showShareIcons);
  };
  const toggleAccordion = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };
  const getURL = async (id: string) => {
    await createShortUrl(`${process.env.NEXTAUTH_URL}blog?blogID=${id}`).then(
      (url) => {
        setShareURL(url);
      }
    );
  };
  return (
    <div className="grid mt-2 mb-4 visible md:hidden">
      {items.map((item, index) => {
        
        return (
          <div key={index + item.headline} className="p-4 ">
            {activeIndex === index && (
              <div className="justify-center">
                <h3 className="font-copperplate font-bold text-black-100 text-[32px] justify-center p-2">
                  {item.headline}
                </h3>
                <h3
                  className="text-lg font-courierPrime text-[#44576D] justify-center 
              xs:pl-[5.25rem] 
              pl-[4.25rem] md:pl-1"
                >
                  By AI {session?.user?.name}
                </h3>
                <div className="pl-[4.25rem] md:pl-1">
                  <p className="bg-gradient-to-r from-orange-100 to-orange-200 hover:bg-orange-100 text-white text-sm rounded-full font-copperplate py-2 px-4 w-[6.5rem]">
                    @PFFT.AI
                  </p>
                </div>
                <div className="h-[1px] lg:w-2/5 xl:w-[25%] mb-5 bg-gray-400 rounded-xl  w-full mt-[0.75rem]"></div>
              </div>
            )}
            <div
              className={`flex justify-center items-center cursor-pointer font-bold rounded-xl border-2 ${
                activeIndex === index
                  ? "border-orange-500 border-4"
                  : "border-gray-400"
              }`}
              onClick={() => toggleAccordion(index)}
            >
              <h1 className="font-courierPrime p-2 text-[20px]">
                {item.headline}
              </h1>
            </div>
            {activeIndex === index && (
              <div className="justify-center p-4 font-courierPrime text-wrap">
                <p>
                  {item.article.split("<br>").map((line, index) => {
                    return (
                      <React.Fragment key={index + line}>
                        {line}
                        <br />
                      </React.Fragment>
                    );
                  })}
                </p>

                {/* Button for share */}
                <div className="col-span-1 flex flex-col items-center xl:order-3 xl:h-screen xl:justify-center lg:order-3 lg:h-screen lg:justify-center slg:order-2 slg:justify-start order-2 justify-end">
                  <div className="relative" style={{ minHeight: "100px" }}>
                    <button
                      className="rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200 2xl:w-[267px] 2xl:h-[106px] 2xl:mb-[3rem] 2xl:text-[32px] xl:w-[180px] xl:h-[100px] xl:mb-[3rem] xl:text-[30px] lg:w-[150px] lg:h-[90px] lg:mb-[3rem] lg:text-[24px] lg:font-normal md:w-[210px] md:h-[100px] md:text-[32px] md:mt-[0.5rem] xs:w-[190px] xs:h-[56px] xs:mt-[3rem] xs:text-[20px] w-[190px] h-[56px] mt-[3rem] text-[20px] text-slate-50 font-courierPrime"
                      onClick={() => {
                        setBlogID(item._id)
                        handleShareClick();
                      }}
                     
                    >
                      Share
                    </button>
                    {showShareIcons && (
                      <div className="w-full relative mt-2 border-2 border-[#FF4738] bg-white rounded-2xl shadow-lg 4">
                        <ul className="flex justify-around">
                          <li className="">
                            <img
                              className="inset-0 object-cover w-[40px] h-[40px]"
                              src="/assets/images/insta.png"
                              alt="Instagram"
                            />
                          </li>

                          <FacebookShareButton url={shareURL} hashtag={"#pfft"}>
                            <img
                              className="inset-0 object-cover w-[40px] h-[40px]
                                  md:w-[30px] md:h-[30px]
                                  lg:w-[45px] lg:h-[45px]"
                              src="/assets/images/facebook.png"
                              alt="Facebook"
                            />
                          </FacebookShareButton>

                          <TwitterShareButton
                            url={shareURL}
                            title={item.headline}
                            via={session?.user?.name as string}
                          >
                            <img
                              className="inset-0 object-cover w-[40px] h-[40px]
                                  md:w-[30px] md:h-[30px]
                                  lg:w-[45px] lg:h-[45px]"
                              src="/assets/images/twitter.png"
                              alt="Twitter"
                            />
                          </TwitterShareButton>
                        </ul>
                        <ul className="flex justify-around">
                          <li className="">
                            <img
                              className="inset-0 object-cover w-[60px] h-[60px]"
                              src="/assets/images/yahoo.png"
                              alt="Yahoo"
                            />
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
