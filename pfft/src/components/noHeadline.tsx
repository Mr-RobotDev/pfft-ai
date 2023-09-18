'use client'
import { useRouter } from "next/router";
import "animate.css/animate.min.css";

const NoHeadline = () => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col items-center justify-center content-center  
     mt-40 md:mt-20
      "
    >
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
        <span
          className="font-[400] text-[black]
          "
        >
          {"No valid outputs generated. Please "}
        </span>
        <span
          className="text-[#FF3031]"
          onClick={() => {
            router.push("/");
          }}
        >
          pfft again.
        </span>
      </div>
    </div>
  );
};

export default NoHeadline;
