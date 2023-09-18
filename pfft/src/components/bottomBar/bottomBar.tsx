'use client'
import HeadlineCarousel from "@/components/cerousel";

const BottomBar: React.FC = () => {
  return (
    <div className="flex items-center">
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
  );
};

export default BottomBar;
