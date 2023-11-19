'use client'
import { ReactTicker } from "@guna81/react-ticker";
import { useState, useEffect } from "react";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";
import { useRouter } from "next/router";
interface Props {
}

const HeadlineCarousel: React.FC<Props> = () => {
  const router = useRouter();
  const [myHeadlines, setHeadlines] = useState<Array<{headline: string, blog?: string}>>([]);
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
  
  const routeToBlog = (blogID: string) => {
    router.push(`/blog?blogID=${blogID}`);
  }

  const renderHeadline = (item: {headline: string; blog?: string}) => {
    return <div className="ticker-module_tickerText__ryjAR"
    onClick={() => routeToBlog(item.blog || "")}
    >{item.headline}</div>;
  }

  return (
    <div className="">
      <ReactTicker
        data={myHeadlines?.map((item) => item)}
        component={renderHeadline}
        speed={54}
        keyName="_id"
      />
    </div>
  );
};

export default HeadlineCarousel;
