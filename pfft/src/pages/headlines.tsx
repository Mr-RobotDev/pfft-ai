'use client'
import { Meta } from "@/layouts/Meta";
import { useState, useEffect } from "react";
import { Main } from "@/templates/Main";
import { FC } from "react";
import { useRouter } from "next/router";
import "animate.css/animate.min.css";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";
import HeadlineWaiting from "@/components/waiting";
import FetchHeadlines from "@/components/fetchHeadlines";
import { useSession } from "next-auth/react";
import showToast from "@/lib/toast";
import { nanoid } from 'nanoid';

const GeneratingHeadlines: FC = () => {
  const router = useRouter();
  const { opinion } = router.query;
  const isFreeCredit = router.query.isFreeCredit as unknown as boolean;
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession().data
  const status = useSession().status

  useEffect(() => {
      if(status === "loading" ) return
    generateHeadlines();
  }, [session?.user?._id]);

  const deductAmount = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/amountDeduction?userID=${session?.user?._id}`,
      method: "GET",
    };

    try {
      return await APICaller(options);
    } catch (error) {
      console.error(error); // Handle the error
    }
  };

  const generateHeadlines = async () => {
    setIsLoading(true);
    setHeadlines([]);
    if (!session) {
      const res = await fetch("https://api.ipify.org?format=json");
      const { ip } = await res.json();
      let pffting = localStorage.pffting;
      if (pffting) pffting = JSON.parse(pffting);
      if (!pffting) {
        localStorage.setItem("pffting", JSON.stringify({ ip, count: 1, id : nanoid(12) }));
      } else if (pffting && pffting.count >= 10) {
        setIsLoading(false);
        showToast(
          <div>
            <div>Create a free account to continue.</div>
            <div className="flex justify-start mt-2">
              <button
                onClick={() => {
                  router.push("/signup");
                }}
                className="bg-gradient-red-1-to-red-2 text-white rounded-full px-4 py-2"
              >
                Continue for Free
              </button>
            </div>
          </div>
        );
        return;
      } else {
        localStorage.setItem(
          "pffting",
          JSON.stringify({ ...pffting, count: pffting.count + 1 })
        );
      }
    }
    const requestBody = {
      opinion: opinion,
    };
    const options: APICallerOptions = {
      body: requestBody,
      URL: `/api/generateHeadlines`,
      method: "POST",
    };
    try {
      const result = await APICaller(options);
      console.log("=====>",result);
      setHeadlines(result?.headlines);
      if (session) {
        deductAmount();
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Main
      meta={
        <Meta title="Generating-Headlines" description="GeneratingHeadlines" />
      }
    >
      {isLoading ? (
        <HeadlineWaiting />
      ) : (
        <FetchHeadlines
          headlines={headlines}
          opinion={opinion as string}
          handleRePFFT={generateHeadlines}
          isFreeCredit={isFreeCredit}
        />
      )}
    </Main>
  );
};

export default GeneratingHeadlines;
