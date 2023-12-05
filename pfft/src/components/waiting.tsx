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
          className="
            text-[black] whitespace-normal overflow-hidden font-normal text-center font-courierPrime leading-tight 
            animate__animated animate__backInDown
            mb-[50px] text-[14px] // Default for the smallest screens
            xs:mb-[60px] xs:text-[22px] // Increased for mobile
            xms:mb-[70px] xms:text-[22px] // Adjust if needed for slightly larger screens
            md:mb-[90px] md:text-[28px]
            lg:mb-[95px] lg:text-[38px]
            xl:mb-[120px] xl:text-[48px]
            "
        >
          Ai provides the comedy dirt...
        </div>
          Ai provides the comedy dirt...
        </div>

        <button
          className="
            rounded-full bg-gradient-to-r from-orange-100 to-orange-200 text-white font-copperplate leading-6
            w-[133px] text-[16px] py-2 px-5
            xs:w-[160px] xs:text-[18px] xs:py-2 xs:px-5 // Increased width and slightly decreased text size for mobile
            slg:w-[183px] slg:text-[23px] slg:py-3 slg:px-8
            md:w-[200px] md:text-[26px] md:py-3 md:px-8
            lg:w-[220px] lg:text-[30px] lg:py-4 lg:px-10
            xl:w-[240px] xl:text-[34px] xl:py-4 xl:px-12
          "
        >
          pffting&nbsp;<span className="pl-1"><PulseLoader color="#ffffff" size={3} /></span>
        </button>



        <div
          className=" text-[black] whitespace-normal overflow-hidden font-400 text-center font-courierPrime
            animate__animated animate__backInUp
            mt-[40px] text-[20px] leading-tight // Default for the smallest screens
            xs:mt-[45px] xs:text-[32px] xs:leading-[50px] // Increased size and slightly increased line spacing for mobile
            xms:mt-[50px] xms:text-[26px]
            md:mt-[100px] md:text-[50px] md:leading-[73px]
            lg:mt-[108px] lg:text-[50px]
            xl:mt-[122px] xl:text-[50px]
            "
        >
          humans find the gold.
        </div>
      </div>
    </div>
  );
};

export default HeadlineWaiting;
