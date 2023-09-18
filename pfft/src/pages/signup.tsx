'use client'
import { validateRegister } from "@lib/validate";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import _ from "lodash";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import "animate.css/animate.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import showToast from "@/lib/toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ReCAPTCHA from "react-google-recaptcha";
import React, { useRef } from "react";

export default function Signup() {
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [isFormFilled, setIsFormFilled] = useState(false);
  const recaptchaRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  //const [error, setError] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null);
  const [tokenRefreshTimeout, setTokenRefreshTimeout] = useState<number | undefined>(undefined);

  useEffect(() => {
    setVisible(true);
  }, []);

  const refreshRecaptcha = (): void => {
    if (recaptchaRef.current) {
      (recaptchaRef.current as any).reset(); // Reset the reCAPTCHA component
      setRecaptchaValue(""); // Clear the previous token value
      setTokenExpiration(null); // Clear the token expiration time
    }
  };

  const scheduleTokenRefresh = () => {
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout); // Clear any existing timeout
    }

    setTokenRefreshTimeout(window.setTimeout(refreshRecaptcha, 60 * 1000)); // Refresh the token after 1 minute (60 seconds)
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenExpiration && Date.now() > tokenExpiration.getTime()) {
        refreshRecaptcha();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(tokenRefreshTimeout);
    };
  }, [tokenExpiration, tokenRefreshTimeout]);

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      recaptchaValue: "",
    },
    validate: validateRegister,
    onSubmit,
  });

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaValue(token);
    setIsFormFilled(formik.isValid && formik.dirty);
    setTokenExpiration(new Date(Date.now() + 60 * 1000)); // Set token expiration to 1 minute (60 seconds) from now
    scheduleTokenRefresh();
  };

  async function onSubmit(values: any) {
    //setError("");
    setLoading(true);
    //const token = recaptchaValue;

    // const captchaRes = await fetch("/api/verify-recaptcha", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ token }),
    // });
    //const data = await captchaRes.json();


    if (!(formik.isValid)) {
      //setError("Please fill all form values first.");
      showToast("Please fill all form values first pllllll");
      setLoading(false);
      return;
    }

 //   if (true) {
      try {
        const res = await fetch(`/api/signup`, {
          method: "POST",
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
            userType: "email/password",
            //recaptchaValue: recaptchaValue,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 201) {
            const status: any = await signIn("credentials", {
                redirect: false,
                username: values.username,
                password: values.password,
                callbackUrl: "/",
            });

            if (status.ok) {
                router.push(router.query.callbackurl || status.url);
            } else {
                //setError(status.error);
                showToast(status.error);
            }
        } else if (res.status === 406) {
          showToast("User already exists with this email");
        } else if (res.status === 400) {
            showToast("Username already exists");
        //   const data = await res.json();
        //   if (data.success === true) {
        //     showToast(
        //       "reCAPTCHA verification succeeded. Signup API response: " +
        //         JSON.stringify(data)
        //     );
        //   } else {
        //     showToast(
        //       "reCAPTCHA verification succeeded, but there was an error in the Signup API response."
        //     );
        //   }
        } else {
          showToast("Something went wrong.");
        }
      } catch (error: any) {
        //setError(error.message);
        showToast(error.message);
      }
    // } else {
    //   showToast("CAPTCHA verification failed.");
    // }

    setLoading(false);
  }

  function handleGoogle() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>

      <ToastContainer />
      <div
        className={`animate__animated ${
          visible ? "animate__flipInY" : ""
        } h-auto`}
        style={{ animationDuration: "1s" }}
      >
        <div className="absolute top-4 left-8 right-0 flex items-center p-4 bg-white z-10 w-1/3">
          <Image
            src="/assets/icons/Logo.svg"
            alt="Logo"
            width={191}
            height={36}
          />
        </div>

        <div
          className="
        flex flex-col h-full overflow-auto justify-start
        md:flex-row "
        >
          <div
            className="
            w-[100%] bg-transparent h-full justify-start
            xs:w-full
            sm:p-20
            md:w-[1100px] md:pr-[0.5px] md:pl-[7px]
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
                  className="w-full text-left p-3 text-2xl font-bold font-courierPrime  text-[#E86A33] leading-9 justify-left mt-[10rem] mt:[10rem]
                md:text-[32px] md:pl-[3rem] md:pt-[6rem] md:mb-[-1.5rem] md:mt-[7.25rem] 
                lg:pl-[12.5rem] lg:pt-[6rem] lg:text-[32px]
                xl:pt-[0.5rem] xl:pl-[1.5rem]
                "
                >
                  Welcome to pfft.ai
                </h1>
              </div>
              <form
                onSubmit={formik.handleSubmit}
                className="
                w-full flex flex-col text-left font-courierPrime
                md:w-[75%] md:p-6 md:m-2
                lg:w-[72%] lg:pl-[62px] lg:pr-[8rem] lg:ml-[8.75rem] lg:mr-[1.75rem]
                xl:mr-1 xl:w-[805px] xl:ml-[-3rem]
                3xl:w-[1000px]"
              >
                <div
                  className={`relative mt-7 mb-5 xl:w-full w-full ${
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
                    xl:text-base "
                    placeholder="Please enter your Username"
                    autoComplete="off"
                    {...formik.getFieldProps("username")}
                  />
                  <label
                    htmlFor="username"
                    className="floating-label font-bold absolute left-4 -top-4 px-3 bg-white text-xl text-black transition-all duration-200 pointer-events-none"
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
                  className={`relative mt-7 mb-5 w-full ${
                    formik.errors.email && formik.touched.email
                      ? "animate__animated animate__shakeX"
                      : ""
                  }`}
                >
                  <input
                    type="email"
                    id="email"
                    className="
                    w-full px-12 py-2 h-[72px] font-light placeholder-gray-400 rounded-xl border border-gray-500 focus:outline-orange-200 focus:ring-0
                    xl:text-base
                    md:w-[672x]"
                    placeholder="Please enter your Email ID"
                    autoComplete="off"
                    {...formik.getFieldProps("email")}
                  />
                  <label
                    htmlFor="email"
                    className="
                    floating-label font-bold absolute left-4 -top-4 px-3 bg-white text-xl text-black transition-all duration-200 pointer-events-none"
                  >
                    Email
                  </label>
                </div>
                {formik.errors.email && formik.touched.email && (
                  <span className="text-rose-500 pl-6">
                    {formik.errors.email}
                  </span>
                )}

                <div
                  className={`relative mt-7 mb-5 w-full ${
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
                      className="absolute h-5 w-5 top-2/4 right-7 transform -translate-y-2/4 text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute h-5 w-5 top-2/4 right-7 transform -translate-y-2/4 text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                  <label
                    htmlFor="password"
                    className="
                    floating-label font-bold absolute left-4 -top-4 px-3 bg-white text-xl text-black transition-all duration-200 pointer-events-none"
                  >
                    Password
                  </label>
                </div>
                {formik.errors.password && formik.touched.password && (
                  <span className="text-rose-500 pl-6">
                    {formik.errors.password}
                  </span>
                )}
                <div className="flex flex-col justify-center items-center mt-5 mb-4" >
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={
                      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string
                    }
                    onChange={(token: any) => handleRecaptchaVerify(token)}
                  />

                  {recaptchaValue === "" && isFormFilled && (
                    <span className="text-rose-500 pl-6">
                      "Please complete the reCAPTCHA"
                    </span>
                  )}
                </div>
                <div className="mt-2 mb-4 flex flex-col ">
                  <button
                    className="text-center
                    mt-5 rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200  sm:py-4 px-[72px] text-slate-50 font-courier-prime text-lg sm:text-2xl py-4
                    lg:px-4 lg:py-4 
                    xl:px-4 xl:py-3"
                    type="submit"
                    disabled={
                      loading || !_.isEmpty(formik.errors) || !recaptchaValue
                    }
                  >
                    Register to pfft
                  </button>
                  <p className="text-center font-courierPrime mt-8 sm:text-lg text-xl font-bold ">
                    Already have an account?{" "}
                    <Link
                      className="
                      text-orange-200 font-courierPrime hover:border-red-500 font-bold text-xl
                      md:text-xl "
                      style={{ textDecoration: "none" }}
                      href="/signin"
                    >
                      Log in
                    </Link>
                  </p>
                  <div
                    className="
                  flex justify-center mt-7 space-x-9"
                  >
                    <div className="w-full h-5">
                      <Image
                        alt="divider"
                        src="/assets/images/divider.svg"
                        width={1000}
                        height={220}
                      />
                    </div>
                  </div>
                  <div
                    className="
                  mx-auto mt-4 flex pl-3 items-center justify-center rounded-md p-2 border border-solid border-orange-300"
                  >
                    <span>
                      <Image
                        src="/assets/google.png"
                        alt="google"
                        width={35}
                        height={27}
                      />
                    </span>
                    <button
                      className="
                      w-full text-gray-700 pl-4 px-8 py-1 text-[17px] font-bold font-courierPrime"
                      type="button"
                      //disabled={process.env.IS_PRODUCTION === "true" ? false : true}
                      onClick={handleGoogle}
                    >
                      Signup with Google
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="justify-right hidden relative xl:flex flex-col xl:w-[1500px] h-[1200px] 3xl:w-[1700px] bg-[#FFFFFF] ">
            <Image
              className="w-[1100px] h-full rounded-l-2xl object-cover"
              src="/assets/images/signup_side_img.png"
              alt="Image"
              width={800}
              height={0}
            />
          </div>
        </div>
      </div>
    </>
  );
}
