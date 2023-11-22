'use client'
import PulseLoader from "react-spinners/PulseLoader";
import "animate.css/animate.min.css";

interface Props {}

const HeadlineWaiting: React.FC<Props> = () => {
  return (
    <div className="flex justify-center h-screen mt-40 md:mt-24">
      <div
        className="
      flex flex-col items-center
      w-[250px] 
      xs:w-[300px] 
      md:w-[550px]
      slg:w-[702]"
      >
        <div
          className="text-[black] whitespace-normal overflow-hidden font-normal text-center font-courierPrime leading-tight 
          animate__animated animate__backInDown
          mb-[50px] text-[14px]   // Increased from 12px to 14px
          xs:mb-[60px] xs:text-[17px]   // Increased from 15px to 17px
          xms:mb-[70px] xms:text-[22px]   // Increased from 20px to 22px
          md:mb-[90px] md:text-[32px]   // Increased from 30px to 32px
          lg:mb-[95px] lg:text-[38px]   // Increased from 35px to 38px
          xl:mb-[120px] xl:text-[48px]   // Increased from 45px to 48px
          "
        >
          The Ai provides the comedy dirt...
        </div>

        <div className="animate__animated animate__tada">
          <button
            className="
          rounded-full bg-gradient-to-r from-orange-100 to-orange-200 text-white font-copperplate leading-6
          w-[133px] text-[16px] py-2 px-5
          xs:w-[153px] xs:text-[20px] xs:py-2 xs:px-5
          slg:w-[183px] slg:text-[23px] slg:py-3 slg:px-8 
          "
          >
            pffting
            <span className="pl-1">
              <PulseLoader color="#ffffff" size={3} />
            </span>
          </button>
        </div>

        <div
          className=" text-[black] whitespace-normal overflow-hidden font-400 text-center font-courierPrime leading-[73px] 
          animate__animated animate__backInUp
        mt-[40px] text-[20px]
        xs:mt-[45px] xs:text-[24px]
        xms:mt-[50px] xms:text-[26px]
        md:mt-[100px] md:text-[50px]
        lg:mt-[108px] lg:text-[50px]
        xl:mt-[122px] xl:text-[50px]
        "
        >
          and you find the gold.
        </div>
      </div>
    </div>
  );
};

export default HeadlineWaiting;
