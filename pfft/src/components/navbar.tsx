import { signOut, useSession } from "next-auth/react";
import React, { MouseEvent } from "react";
import { useRouter } from "next/router";

interface NavbarProps {}
const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();
  // const isAccountRoute = router.pathname === "/account";
  // const isPublicPage = router.pathname === "/blog";
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="md:mx-8">
      <nav className="py-6">
        <ul className="flex justify-between border-none text-gray-700">
          <li
            className="mr-3 md:ml-3 ml-4 pt-1 md:leading-9 md:mr-6 cursor-pointer 
          h-[10px] w-[100px]
          xms:h-[20px] xms:w-[125px] 
          md:h-[37px] md:w-[191px]"
          >
            <img
              onClick={() => {
                router.push("/");
              }}
              src="/assets/icons/Logo.svg"
              alt="AppLogo"
            />
          </li>
          <li className="flex font-courierPrime text-[13px] sm:text-[16px] md:text-[32px] font-normal leading-9 md:leading-9 text-black">
            {!session ? (
              <React.Fragment>
                <span
                  className="mr-2 sm:mr-6 cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    router.push("/signin");
                  }}
                >
                  login
                </span>
                <span
                  className="mr-2 sm:mr-6 cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    router.push("/signup");
                  }}
                >
                  Signup
                </span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span
                  onClick={() => {
                    router.push("/account");
                  }}
                  className="mr-2 sm:mr-6 cursor-pointer hover:text-gray-900 underline underline-offset-8  decoration-[#FF0000] decoration-2"
                >
                  account
                </span>

                <span
                  className="md:mr-4 mr-4  border-none text-black cursor-pointer hover:text-gray-900"
                  onClick={(e: MouseEvent<HTMLSpanElement>) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  logout
                </span>
              </React.Fragment>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
