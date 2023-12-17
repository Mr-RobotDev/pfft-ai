'use client'
import { useRouter } from "next/router";
import HeadlineCarousel from "@/components/cerousel";
import React, { useEffect, useState } from 'react';

const BottomBar: React.FC = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const isHomePage = router.pathname === '/';
    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        // Check if the user has scrolled to the bottom of the page
        setShouldShow(scrollPosition + windowHeight >= documentHeight);
    };
    //Show Privacy-Terms Link only for the Home Page
    if(isHomePage) {
        // Attach the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Initial check in case the page is loaded at the bottom
        handleScroll();
    }

    // Cleanup the event listener on component unmount
    return () => {
        if(isHomePage)
            window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div>
        <div className="flex items-center h-77 bg-gradient-red-1-to-red-2">

          <div className="text-[#000000] font-copperplate ml-2 mr-2 2xl:py-1">
            <span className=" font-[700]
            text-[12px] leading-[22px]
            sm:text-[21px] sm:leading-[28px]
            md:text-[22px] md:leading-[29px]
            lg:text-[23px] lg:leading-[30px]
            xl:text-[24px] xl:leading-[31px] xl:ml-1
            2xl:text-[34px] 2xl:leading-[31px]">
              PFFT
            </span>
            <span className="ml-1 mr-1 font-[700]
            text-[10px] leading-[22px]
            sm:text-[16px] sm:leading-[28px]
            md:text-[17px] md:leading-[29px]
            lg:text-[18px] lg:leading-[30px]
            xl:text-[19px] xl:leading-[31px]
            2xl:text-[25px] 2xl:leading-[31px]">
              .AI
            </span>
            <span className="font-[700]
            text-[12px] leading-[22px]
            sm:text-[21px] sm:leading-[28px]
            md:text-[22px] md:leading-[29px]
            lg:text-[23px] lg:leading-[30px]
            xl:text-[24px] xl:leading-[31px]
            2xl:text-[34px] 2xl:leading-[31px]">
              NEWS
            </span>
          </div>

          <HeadlineCarousel />

        </div>
        {
            shouldShow &&
            <div className="float-right w-[100%] items-end items-center px-2 text-sm bg-footer space-x-2">
                <a href="https://pfft.ai/privacy-policy" className="text-[#757575] float-right mx-2">Privacy Policy</a>
                <a href="https://pfft.ai/term-condition" className="text-[#757575] float-right mx-2">Terms and Conditions</a>
            </div>
        }
    </div>
  );
};

export default BottomBar;
