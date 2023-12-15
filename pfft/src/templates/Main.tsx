'use client'
import { useRouter } from "next/router";
import { type ReactNode } from "react";
import Navbar from "@/components/navbar";
import Tracking from "@/components/tracking";
import BottomBar from "@/components/bottomBar/bottomBar";
import { ToastContainer } from "react-toastify";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

export function Main(props: IMainProps) {
  const router = useRouter();

  const isAccountRoute = router.pathname === "/account";
  const isPaymentRoute = router.pathname === "/payment";
  const shouldShowFooter = !isAccountRoute && !isPaymentRoute;

  return (
    <div className="w-full text-gray-700 antialiased">
      {props.meta}
      <div className="">
        <ToastContainer />
        <header className="">
          <Navbar />
        </header>
        <main className="content py-5 text-xl">{props.children}</main>
        <Tracking />
      </div>
      {shouldShowFooter && (
        <footer className="fixed z-10 w-full bottom-0">
          <BottomBar />
        </footer>
      )}
    </div>
  );
}
