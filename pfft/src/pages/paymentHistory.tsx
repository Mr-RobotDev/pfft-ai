'use client'
import { Meta } from "@/layouts/Meta";
import { useState, useEffect } from "react";
import { Main } from "@/templates/Main";
import { FC } from "react";
import "animate.css/animate.min.css";
import PulseLoader from "react-spinners/PulseLoader";
import { toDollars } from "@/utils/helper";
import { useSession } from "next-auth/react";
interface Transaction {
  id: string;
  invoice: string;
  amount: number;
  billing_details: {
    name: string;
    email: string;
  };
  receipt_url: string;
  currency: string;
  status: string;
  created: number;
}

const PaymentHistory: FC = () => {
  const session = useSession().data;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startingAfter, setStartingAfter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const url = `/api/transaction?userID=${session?.user?._id}${
        startingAfter ? `&startingAfter=${startingAfter}` : ""
      }`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setTransactions(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error retrieving transaction history:", error);
      }
    };
    if (session?.user?._id) fetchTransactions();
  }, [session?.user?._id, startingAfter]);

  useEffect(() => {
    function handleScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
        if(clientHeight){
            if (scrollTop + clientHeight >= scrollHeight) {
                const lastItem= transactions[transactions?.length - 1];
                setStartingAfter(lastItem?.id);
              }
        }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function extractInitials(str: string) {
    const words = str?.split(" ");
    const initials = words?.map((word: string) => word.charAt(0).toUpperCase());
    const username = initials?.join("");
    return username;
  }

  return (
    <Main meta={<Meta title="Payment History" description="Payment History" />}>
      {loading ? (
        <div className="flex justify-center items-center px-5 py-3">
          <PulseLoader color="#FF8B4B" size={20} />
        </div>
      ) : (
        <div className="w-full">
          <div className="mx-4">
            <div className="text-center">
              <h1 className="text-black-100 text-[27px] font-courierPrime font-bold slg:text-[35px] xl:text-[55px]">
                PAYMENT HISTORY
              </h1>
            </div>
            {/* Username */}
            <div className="bg-black  break-all  md:flex md:grid-cols-2 md:gap-4 justify-left md:my-10 my-4 grid-rows-1 grid justify-center md:justify-start gap-2 mx-10">
              <div className="md:col-span-1 row-span-1 ">
                <div className="relative flex justify-center">
                  <div className="h-[60px]  w-[60px] relative rounded-full bg-[#FF8E4C] border-2 border-[#FF0000] justify-center xs:h-[80px] xs:w-[80px] sm:h-[75px] sm:w-[75px] md:h-[90px] md:w-[90px] slg:h-[100px] slg:w-[100px] lg:h-[120px] lg:w-[120px] xl:h-[144px] xl:w-[144px] xl:border-4">
                    <div className="relative flex justify-center">
                      <div className="font-[700] text-white font-courierPrime text-[40px] xs:text-[54px] md:text-[60px] slg:text-[70px] lg:text-[80px] xl:text-[95px]">
                        {extractInitials(session?.user?.name as string)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-1 row-span-1 md:text-left text-center">
                <div className="md:my-[0.5rem] lg:my-[2.25rem] lg:col-span-4 xl:col-span-10 xl:my-[2.5rem]">
                  <div
                    className="font-bold text-[14px] text-black-100  font-courierPrime
                    xs:text-[24px]
                    "
                  >
                    {(session?.user?.name) }
                  </div>
                  <div
                    className="font-[400] text-[14px] text-black-100 font-courierPrime leading-6
                    xs:text-[24px]
                   "
                  >
                    {session?.user?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Table of history */}
          <div className="mx-4 overflow-auto rounded-xl my-8">
            <table className="flextable-auto w-full  bg-[#FDDDD2] shadow-xl">
              <thead className="border-b-2 border-dashed border-[#44576D] py-3">
                <tr>
                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap py-2">
                    #
                  </th>
                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap py-2">
                    Status
                  </th>
                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap py-2">
                    Name
                  </th>
                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap py-2">
                    Email
                  </th>
                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap py-2">
                    Amount
                  </th>

                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap py-2">
                    Paid On
                  </th>
                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap py-2">
                    Expiry Date
                  </th>
                  <th className="md:py-4 px-2  text-[#FF0000] font-courierPrime md:text-[18px] slg:text-[24px] text-[15px] whitespace-nowrap">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="py-4">
                {transactions?.length > 0 &&
                  transactions?.map((item, index) => {
                    const serialNumber = index + 1;
                    const expires = new Date(
                      new Date(item.created * 1000).getTime() +
                        30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString();
                    return (
                      <tr key={item.id}>
                        <td className="md:py-6 slg:px-7 px-2 font-courierPrime text-center text-black-100 slg:text-[22px] font-bold md:text-[18px] py-2 text-[12px]">
                          {serialNumber}
                        </td>
                        <td className="md:py-6 slg:px-7 px-2 font-courierPrime text-center text-black-100 slg:text-[22px] md:text-[18px] text-[12px] whitespace-nowrap">
                          {item.status === "succeeded" ? (
                            <span className="flex items-center text-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-red-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </span>
                          )}
                        </td>
                        <td className="md:py-6 slg:px-7 px-2  font-courierPrime text-center text-black-100 slg:text-[22px] md:text-[18px] text-[12px] whitespace-nowrap">
                          {item.billing_details.name}
                        </td>
                        <td className="md:py-6 slg:px-7 px-2  font-courierPrime text-center text-black-100 slg:text-[22px] md:text-[18px] text-[12px] whitespace-nowrap">
                          {item.billing_details.email}
                        </td>
                        <td className="md:py-6 slg:px-7 px-2  font-courierPrime text-center text-black-100 slg:text-[22px] md:text-[18px] text-[12px] whitespace-nowrap">
                          {toDollars(item.amount)}$
                        </td>

                        <td className="md:py-6 slg:px-7 px-2  font-courierPrime text-center text-black-100 slg:text-[22px] md:text-[18px] text-[12px] whitespace-nowrap">
                          {new Date(item.created * 1000).toLocaleDateString()}
                        </td>
                        <td className="md:py-6 slg:px-7 px-2  font-courierPrime text-center text-black-100 slg:text-[22px] md:text-[18px] text-[12px] whitespace-nowrap">
                          {expires}
                        </td>
                        <td
                          className=" md:py-6 slg:px-7 px-2 font-courierPrime text-center text-black-100 slg:text-[14px] md:text-[14px] text-[12px] whitespace-nowrap cursor-pointer"
                          
                        >
                          <a className="bg-white py-2 px-5 text-[black] rounded-lg"
                            href={item.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >

                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Main>
  );
};

export default PaymentHistory;
