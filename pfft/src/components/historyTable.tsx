'use client'
import React, { FC } from "react";
import { toDollars } from "@/utils/helper";
import PulseLoader from "react-spinners/PulseLoader";
interface HistoryTableProps {
  transactions: Transaction[];
  loading: boolean;
}
interface Transaction {
  id: number;
  created: number;
  amount: number;
}
const HistoryTable: FC<HistoryTableProps> = ({ transactions, loading }) => {
  const visibleTransactions = Array.isArray(transactions)
    ? transactions.slice(0, 4)
    : [];

  return (
    <table className="flextable-auto mt-6 w-full">
      <thead>
      <tr className="border-b-2 border-dashed border-[#FF3031]">
          <th className="text-left pl-4 font-courierPrime text-bold text-black-100 text-[15px] xs:text-[18px] sm:text-[20px] md:text-[28px]">
            Date
          </th>
          <th className="font-courierPrime text-bold text-black-100 text-[15px] xs:text-[18px] sm:text-[20px] md:text-[28px] text-center">
            Credits
          </th>
          <th className="text-right pr-4 font-courierPrime text-bold text-black-100 text-[15px] xs:text-[18px] sm:text-[20px] md:text-[28px]">
            Amount
          </th>
        </tr>
      </thead>
      {loading ? (
        <tbody>
          <tr>
            <td colSpan={3} className="px-5 py-3">
              <PulseLoader
                className="items-end justify-end flex"
                color="#FF8B4B"
                size={20}
              />
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          {visibleTransactions.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="w-full font-courierPrime px-5 py-4 text-center font-bold text-[#44576D] md:text-[16px] lg:text-[22px] text-[14px]"
              >
                No Transaction History Available
              </td>
            </tr>
          ) : (
            visibleTransactions.map((item) => {

              return (
                <tr
                key={item?.id}
                className="font-courierPrime font-bold text-black-100 text-[16px]"
              >
                <td className="py-4 md:text-[22px] text-[14px] md:py-3 pl-4 px-2">
                  {new Date(item.created * 1000).toLocaleDateString()}
                </td>
                <td className="py-4 md:text-[22px] text-center text-[14px] md:py-3  px-2">
                {item.amount === (1071) ? 2000 : 1000}
                </td>
                <td className="sm:text-[16px] text-[14px] md:text-[22px] text-end pr-4 px-2">
                  {toDollars(item.amount)}$
                </td>
              </tr>
              );
            })
          )}
        </tbody>
      )}
    </table>
  );
};

export default HistoryTable;
