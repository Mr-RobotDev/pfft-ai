'use client'
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { useRouter } from "next/router";
import React, { FC, useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import APICaller from "@/lib/API_Caller";
import { APICallerOptions } from "@/models/APICaller.types";

const Verify: FC = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const token = (router.query.token || '') as string;

  useEffect(() => {
    if(token != '') {
      verifyUser();
    }
  }, [token]);


  const verifyUser = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/verifyUser?token=${token}`,
      method: "GET",
    };

    try {
      const result = await APICaller(options);
      if(result.status) {
        router.push('/signin');
      }
      setIsLoading(false);
    } catch (error:any) {
      setError('Invalid');
      setIsLoading(false);
    }
  };

  return (
    <Main meta={<Meta title="Blog" description="Blog" />}>
      <div className="xms:mx-16 mx-12 slg:mx-12 lg:mx-[35rem] ">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <PulseLoader color="orange" size={20} />
          </div>
        ) : (
          <>
            {error != '' && (
                <h1 className="article-header font-bold font-copperplate mb-6 text-black-100 text-danger">
                  Invalid data, Unable to verify your account.
                </h1>
            )}
            <div className="flex grid-cols-2">
              <h2 className="text-sm mt-2 font-courierPrime text-[#44576D] pr-5 xms:text-lg">
                Already have account?
              </h2>
              <div className="w-[5.8rem] mb-5 ">
                <div
                  className="bg-gradient-to-r from-orange-100 to-orange-200 hover:bg-orange-100
                      text-white
                      text-sm rounded-full font-copperplate py-2 px-4"
                >
                  Login
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Main>
  );
};

export default Verify;
