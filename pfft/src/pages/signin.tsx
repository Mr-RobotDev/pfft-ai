'use client'
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import _ from "lodash";
import { validateLogin } from "@/lib/validate";
import "animate.css/animate.min.css";
import React from "react";
import showToast from "@/lib/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Signin() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  useEffect(() => {
    setVisible(true);
  }, []);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: validateLogin,
    onSubmit,
  });

  async function onSubmit(values: any) {
    setLoading(true);
    const status: any = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
      callbackUrl: "/",
    });
    if (status.ok) {
      router.push(router.query.callbackurl || status.url);
    } else {
      showToast(status.error);
    }
    setLoading(false);
  }

  function handleGoogle() {
    signIn("google", { callbackUrl: "/" });
  }
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <ToastContainer />
      <div
        className={`animate__animated ${
          visible ? "animate__flipInY" : ""
        } h-auto`}
        style={{ animationDuration: "1s" }}
      >
        <div className="absolute top-4 left-8 right-0 flex items-center p-4 z-10 w-1/3">
          <Image
            src="/assets/icons/Logo.svg"
            alt="Logo"
            width={191}
            height={36}
          />
        </div>

        <div className="flex flex-col md:flex-row h-full overflow-auto  justify-start">
          <div
            className="justify-right hidden
                relative  xl:flex 
                flex-col xl:w-[1500px] h-[1200px] 
                3xl:w-[1700px]
                bg-[#FFFFFF] "
          >
            <Image
              className="w-[1100px] h-full rounded-l-2xl object-cover"
              src="/assets/images/side_img_signin.png"
              alt="Image"
              width={800}
              height={0}
            />
          </div>

          <div
            className="
            w-[100%] bg-transparent h-full justify-start
            xs:w-full
            sm:p-20
            md:pr-[0.5px] md:pl-[73px] md:w-[1100px]
            lg:w-full lg:justify-center 
            xl:w-full"
          >
            <div
              className="
              flex w-full flex-col items-left justify-left h-full
              p-5 
              sm:p-1
              md:pl-[6rem] 
              lg:w-full lg:justify-center lg:pl-0 
              xl:pl-[3rem] xl:mb-[5rem]"
            >
              <div className="title">
                <h1
                  className="
                  w-full text-left p-3 text-2xl font-bold font-courierPrime text-[#FF3633] leading-9 justify-left mt-[10rem] mt:[10rem] pl-0.5rem 
                  md:text-[32px] md:pt-[6rem] md:pl-[2.75rem] md:mt-[7.25rem] md:mb-[-1.5rem]
                  lg:pt-[6rem] lg:text-[32px] lg:pl-[15rem]  
                  xl:pl-[2.5rem] xl:pt-[0.5rem]"
                >
                  Welcome Back
                </h1>
                <p
                  className="
                  w-full text-left text-[20px] text-gray-900 font-courierPrime justify-left pl-6 mt-6 
                  pl-0.5rem
                  mb-21md:mt-8  
                  lg:pl-[15rem]
                  xl:pl-[2.5rem] 
                  md:pl-[2.75rem]"
                >
                  Welcome back! Please enter your details
                </p>
              </div>
              <form
                onSubmit={formik.handleSubmit}
                className="
                  w-full md:w-[75%] flex flex-col  text-left font-courierPrime
                  sm:w-full
                  md:p-6 md:m-2
                  lg:w-[72%]  lg:pl-[95px] lg:pr-[8rem] lg:ml-[8.75rem] lg:mr-[1.75rem]
                  xl:w-[905px] xl:ml-[-4rem] xl:mr-[-0.75rem] 
                  3xl:w-[1000px]"
              >
                <div
                  className={`
                  relative mt-7 mb-5 w-full ${
                    formik.errors.username && formik.touched.username
                      ? "animate__animated animate__shakeX"
                      : ""
                  }`}
                >
                  <input
                    type="username"
                    id="username"
                    className="
                      w-full px-12 py-2 h-[72px] font-light placeholder-gray-400 rounded-xl border border-gray-500 focus:outline-orange-200 focus:ring-0
                      md:w-[672x] 
                      xl:text-base
                     "
                    placeholder="Please enter your Username"
                    autoComplete="off"
                    {...formik.getFieldProps("username")}
                  />
                  <label
                    htmlFor="username"
                    className="
                      floating-label text-[24px] font-bold absolute left-4 -top-4 px-3 bg-white  text-black transition-all duration-200 pointer-events-none"
                  >
                    Username
                  </label>
                </div>
                {formik.errors.username && formik.touched.username && (
                  <span className="text-rose-500 pl-6">
                    {formik.errors.username}
                  </span>
                )}

                <div
                  className={`relative mt-7 mb-5  w-full ${
                    formik.errors.password && formik.touched.password
                      ? "animate__animated animate__shakeX"
                      : ""
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="
                      font-light placeholder-gray-400 rounded-xl border border-gray-500 focus:outline-orange-200 focus:ring-0 w-full px-12 py-2 h-[72px]
                      md:w-[672x]
                      xl:text-base"
                    placeholder="Please enter your Password"
                    {...formik.getFieldProps("password")}
                  />
                  {showPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute top-2/4 right-7 transform -translate-y-2/4 text-gray-500 cursor-pointer h-5 w-5"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute top-2/4 right-7 transform -translate-y-2/4 text-gray-500 cursor-pointer h-5 w-5"
                      onClick={() => setShowPassword(true)}
                    />
                  )}

                  <label
                    htmlFor="password"
                    className="
                      floating-label text-[24px] font-bold absolute left-4 -top-4 px-3 bg-white  text-black transition-all duration-200 pointer-events-none"
                  >
                    Password
                  </label>
                </div>
                {formik.errors.password && formik.touched.password && (
                  <span className="text-rose-500 pl-6">
                    {formik.errors.password}
                  </span>
                )}

                <div className="mt-2 mb-4 flex flex-col ">
                  <button
                    className="
                      mt-5 rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200 py-2 sm:py-4 
                      px-[27px] text-slate-50 font-courier-prime text-lg sm:text-2xl mb-[3.5rem] 
                      lg:px-4 lg:py-4 
                      xl:px-4 xl:py-3"
                    type="submit"
                    disabled={loading || !_.isEmpty(formik.errors)}
                  >
                    Login to pfft
                  </button>
                  <p className="text-center font-courierPrime  mb-8 text-xl font-bold">
                    Don't have an account?{" "}
                    <Link
                      className="text-orange-200 font-courierPrime  hover:border-red-500 font-bold text-xl"
                      style={{ textDecoration: "none" }}
                      href="/signup"
                    >
                      Sign Up
                    </Link>
                  </p>
                  <div className="flex justify-center mt-7 space-x-9">
                    <div className="w-full h-5">
                      <Image
                        alt="divider"
                        src="/assets/images/divider.svg"
                        width={1000}
                        height={220}
                      />
                    </div>
                  </div>
                  <div className="mx-auto mt-4 flex pl-3 items-center justify-center rounded-md p-2 border border-solid border-orange-300">
                    <span>
                      <Image
                        src="/assets/google.png"
                        alt="google"
                        width={35}
                        height={27}
                      />
                    </span>
                    <button
                      className="w-full text-gray-700 pl-4 px-8 py-1 text-[17px] font-bold font-courierPrime"
                      type="button"
                      //disabled={process.env.IS_PRODUCTION === "true" ? false : true}
                      onClick={handleGoogle}
                    >
                      Login with Google
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
