'use client'
import { Meta } from "@/layouts/Meta";
import APICaller from "@/lib/API_Caller";
import { APICallerOptions } from "@/models/APICaller.types";
import { Main } from "@/templates/Main";
import { getDestination } from "@/utils/helper";
import { useRouter } from "next/router";
import React, { FC, useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

interface BlogData {
  headline: string;
  username: string;
  article?: string;
}

const Blog: FC = () => {
  const router = useRouter();
  // const blogID = router.query.blogID as string;
  const [blogID, setBlogId] = useState<string>("");
  const [blog, setBlog] = useState<BlogData>({ headline: "", username: "" });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hash = (router.query.blogID || '') as string;
  const getOrignalURL = async () => {
    if(!hash) return;
    const url = await getDestination(hash);
    setBlogId(url.split("blogID=")[1]);
    
  };
  useEffect(() => {
    getOrignalURL();
  }, [hash]);

  useEffect(() => {
    if (blogID) {
      setIsLoading(true);
      getBlog();
    }
  }, [blogID]);

  const getBlog = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/getBlog?historyId=${blogID}`,
      method: "GET",
    };

    try {
      const result = await APICaller(options);
      setBlog(result);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Main meta={<Meta title="Blog" description="Blog" />}>
      <div className="xms:mx-16 mx-12 slg:mx-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <PulseLoader color="orange" size={20} />
          </div>
        ) : (
          <>
            <h1 className="article-header font-bold font-copperplate mb-6 text-black-100">
              {blog.headline}
            </h1>
            <div className="flex grid-cols-2">
              <h2 className="text-sm mt-2 font-courierPrime text-[#44576D] pr-5 xms:text-lg">
                By AI {blog.username}
              </h2>
              <div className="w-[5.8rem] mb-5 ">
                <div
                  className="bg-gradient-to-r from-orange-100 to-orange-200 hover:bg-orange-100 
                      text-white 
                      text-sm rounded-full font-copperplate py-2 px-4"
                >
                  @PFFT.AI
                </div>
              </div>
            </div>
            <div className="h-[1px] lg:w-1/5 xl:w-[25%] bg-gray-600 rounded-xl  w-full mt-[0.75rem]"></div>
            <div className="mt-4 mb-4 text-[#424242] font-courierPrime text-[16px] md:text-[22px]">
              {blog.article
                ?.split("<br>")
                .map((line: string, index: number) => {
                  return (
                    <div key={index} className="mb-2 article-container" dangerouslySetInnerHTML={{
                      __html: line
                    }} />
                  );
                })}
            </div>
          </>
        )}
      </div>
    </Main>
  );
};

export default Blog;
