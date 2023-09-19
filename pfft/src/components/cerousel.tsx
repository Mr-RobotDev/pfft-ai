'use client'
import { ReactTicker } from "@guna81/react-ticker";
import { useState, useEffect } from "react";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";
interface Props {
}

const HeadlineCarousel: React.FC<Props> = () => {
  const [myHeadlines, setHeadlines] = useState<string[]>([]);
  useEffect(() => {
    getAllHeadlines();
  }, []);

  const getAllHeadlines = async () => {
    const options: APICallerOptions = {
      body:
      {},
      URL: "/api/getAllHeadlines",
      method: "GET",
    };

    try {
      const result = await APICaller(options);
      setHeadlines(result.headlines);
    } catch (error) {
      console.error(error); // Handle the error
    }
  };

  return (
    <div className="">
      <ReactTicker
        data={myHeadlines?.map((item) => item)}
        speed={(myHeadlines.length || 0) + 6}
        keyName="_id"
      />
    </div>
  );
};

export default HeadlineCarousel;
