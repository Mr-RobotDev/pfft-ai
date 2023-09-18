'use client'
import 
React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import showToast from "@/lib/toast";
import { APICallerOptions } from "@/models/APICaller.types";
import APICaller from "@/lib/API_Caller";

import { useMediaQuery } from "react-responsive";

interface Props {
  orderNo: any;
  toPay: any;
  credit: any;
  handleLoadingChange: any;
}
const useOptions: any = () => {
  const isXxsScreen = useMediaQuery({ maxWidth: 300 });
  const isXsScreen = useMediaQuery({ minWidth: 301, maxWidth: 375 });
  const isXmsScreen = useMediaQuery({ minWidth: 376, maxWidth: 425 });
  const isMdScreen = useMediaQuery({ minWidth: 426, maxWidth: 768 });

  // Font sizes based on different screen sizes
  const fontSize = isXxsScreen
    ? "12px"
    : isXsScreen
    ? "14px"
    : isXmsScreen
    ? "16px"
    : isMdScreen
    ? "18px"
    : "22px";
  const placeholderFontSize = isXxsScreen
    ? "12px"
    : isXsScreen
    ? "14px"
    : isXmsScreen
    ? "16px"
    : isMdScreen
    ? "18px"
    : "22px";

  const options = useMemo(
    () => ({
      style: {
        base: {
          color: "#424770",
          fontFamily: "Source Code Pro, monospace",
          fontSize: fontSize,
          "::placeholder": {
            color: "#AAB7C4",
            fontSize: placeholderFontSize,
          },
          ":focus": {
            border: "1px solid #FF854A",
          },
        },
        invalid: {
          color: "#9E2146",
        },
      },
    }),
    [fontSize, placeholderFontSize]
  );

  return options;
};
const StripePaymentForm: React.FC<Props> = ({ orderNo, toPay, credit }) => {
  const router = useRouter();
  const session = useSession().data;
  const stripe = useStripe();
  const [loading, setLoading] = useState<boolean>(false);
  const elements = useElements();
  const options = useOptions();
  const [isCardNumberEmpty, setIsCardNumberEmpty] = useState(true);
  const [isCardCvcEmpty, setIsCardCvcEmpty] = useState(true);
  const [isCardExpiryEmpty, setIsCardExpiryEmpty] = useState(true);

  const handleCardNumberChange = (event : any) => {
    setIsCardNumberEmpty(event.empty);
  };

  const handleExpiryChange = (event : any) => {
    setIsCardExpiryEmpty(event.empty);
  };

  const handleCardCvcChange = (event : any) => {
    setIsCardCvcEmpty(event.empty);
  };

  const savePaymentToMongo = async (
    userID: any,
    customerID: any,
    TransactionID: string,
    expires: string,
    created: number
  ) => {
    await fetch("/api/savePaymentHistory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
        customer_id: customerID,
        transaction_id: TransactionID,
        expires: expires,
        created: created,
        orderNo: orderNo,
        paid: parseFloat(toPay),
        credit: parseFloat(credit),
      }),
    });
  };
  const updateCreditRecord = async () => {
    try {
      await fetch("/api/updateUserCredit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: session?.user?._id,
          credit: credit,
        }),
      });

      return;
    } catch (error) {
      console.error(error); // Handle the error
    }
  };
  const getSubscriptionDetails = async () => {
    const options: APICallerOptions = {
      body: {},
      URL: `/api/getsubscriptionDetails?userID=${session?.user?._id}`,
      method: "GET",
    };

    try {
      return await APICaller(options);
    } catch (error) {
      console.error(error); // Handle the error
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);

    getSubscriptionDetails()
      .then(async (res) => {
        if (res) {
          const currentDate = new Date().toLocaleDateString();
          const expiry = res.expiry;

          const currentDateObj = new Date(currentDate);
          const expiryObj = new Date(expiry);

          if (currentDateObj > expiryObj) {
            try {
              const form = event.target as HTMLFormElement;

              const firstNameInput =
                form.querySelector<HTMLInputElement>("#firstName");
              const lastNameInput =
                form.querySelector<HTMLInputElement>("#lastName");
              const name = firstNameInput?.value + " " + lastNameInput?.value;
              const email = session?.user?.email;
              const cardElement = elements.getElement("cardNumber");
              const paymentMethod = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement as any,
                billing_details: {
                  name: name,
                  email: email,
                },
              });
              const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name,
                  email,
                  toPay,
                  paymentMethod: paymentMethod?.paymentMethod?.id,
                }),
              });

              if (!response.ok) {
                setLoading(false);
                return showToast("Payment unsuccessful!");
              }
              const data = await response.json();
              const confirm = await stripe.confirmCardPayment(
                data.clientSecret
              );

              if (confirm.error) {
                setLoading(false);
                return showToast("Payment unsuccessful!");
              }
              updateCreditRecord();
              await savePaymentToMongo(
                session?.user?._id,
                data.customer,
                confirm?.paymentIntent?.id,
                data.expires,
                confirm.paymentIntent.created
              );
              setLoading(false);
              showToast("Payment Successful! Subscription active.");

              router.push("/account");
            } catch (err) {
              console.error(err);
              setLoading(false);
              showToast("Payment failed! ");
            }
          } else if (currentDateObj < expiryObj) {
            showToast(
              "You are currently on Subscription. Please wait for expiry"
            );
          }
        } else {
          const form = event.target as HTMLFormElement;

          const firstNameInput =
            form.querySelector<HTMLInputElement>("#firstName");
          const lastNameInput =
            form.querySelector<HTMLInputElement>("#lastName");
          const name = firstNameInput?.value + " " + lastNameInput?.value;
          const email = session?.user?.email;
          const cardElement = elements.getElement("cardNumber");
          const paymentMethod = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement as any,
            billing_details: {
              name: name,
              email: email,
            },
          });

          const response = await fetch("/api/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              toPay,
              paymentMethod: paymentMethod?.paymentMethod?.id,
            }),
          });

          if (!response.ok) {
            setLoading(false);
            return showToast("Payment unsuccessful!");
          }
          const data = await response.json();
          const confirm = await stripe.confirmCardPayment(data.clientSecret);

          if (confirm.error) {
            setLoading(false);
            return showToast("Payment unsuccessful!");
          }
          updateCreditRecord();
          savePaymentToMongo(
            session?.user?._id,
            data.customer,
            confirm?.paymentIntent?.id,
            data.expires,
            confirm.paymentIntent.created
          );

          showToast("Payment Successful! Subscription active.");
          setLoading(false);
          router.push("/account");
        }
        return null;
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching subscription details:", error);
        // Handle the error here
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-auto">
        <div className="grid-rows-1 lg:grid-cols-2 lg:grid lg:gap-3">
          {/* First Name */}
          <div className="row-span-1 lg:col-span-1  relative mt-7 mb-5 lg:mb-[1.25rem] w-full">
            <input
              type="text"
              id="firstName"
              className="
          w-full px-4 pt-2 h-[32px] font-light placeholder-gray-400 rounded-xl border-[1px] border-[#BEBCBC]  focus:outline-none focus:ring-0 font-courierPrime text-sm
          xms:px-7  xms:h-[40px] xms:text-[18px]
          xl:h-[72px] xl:text-[20px]
          "
              placeholder="First Name"
              autoComplete="off"
              required
            />
            <label
              htmlFor="firstName"
              className="
          floating-label  font-extrabold absolute left-4 -top-4 px-4 bg-white text-black-100 transition-all duration-200 pointer-events-none font-courierPrime text-[16px]
          xms:text-[20px]  xl:text-[24px] xxs:text-[15px]"
            >
              First Name
            </label>
          </div>
          {/* Last Name */}
          <div className="row-span-1 lg:col-span-1 relative mt-7 mb-5 lg:mb-[1.25rem] w-full">
            <input
              type="text"
              id="lastName"
              className="
          w-full px-4 pt-2 h-[32px] font-light placeholder-gray-400 rounded-xl border-[1px] border-[#BEBCBC]  focus:outline-none focus:ring-0 font-courierPrime text-sm
          xms:px-7  xms:h-[40px] xms:text-[18px]
          xl:h-[72px] xl:text-[20px]
          "
              placeholder="Last Name"
              autoComplete="off"
              required
            />
            <label
              htmlFor="lastName"
              className="
          floating-label  font-extrabold absolute left-4 -top-4 px-4 bg-white text-black-100 transition-all duration-200 pointer-events-none font-courierPrime text-[16px] 
          xms:text-[20px]  xl:text-[24px] xxs:text-[15px]"
            >
              Last Name
            </label>
          </div>
        </div>
        {/* Card Number */}
        <div className="relative mt-7 mb-5 lg:mb-[1.25rem] w-full">
          <label
            htmlFor="cardNumber"
            className="floating-label  font-extrabold absolute left-4 -top-4  bg-white text-black-100 transition-all duration-200 pointer-events-none font-courierPrime text-[16px]
          xms:text-[20px] xl:text-[24px] px-4 xxs:text-[15px]"
          >
            Card Holder Number
          </label>
          <CardNumberElement
            id="cardNumber"
            options={options}
            onChange={handleCardNumberChange}
            className="w-full px-4 lg:pt-[0.8rem] pt-3 md:pt-3 xl:pt-7 h-[42px] font-light placeholder-gray-400 rounded-xl border border-gray-500 focus:outline-none focus:ring-0 text-[12px] font-courierPrime
           xms:px-7 xms:h-[40px] xms:text-[18px]
           xl:h-[72px] xl:text-[24px] py-5 sm:text-[12px]"
          />
        </div>

        <div className="grid-rows-1 lg:grid-cols-2 lg:grid lg:gap-3">
          {/* CVC Number */}
          <div className="relative mt-7  mb-5 lg:mb-[1.25rem] w-full">
            <label
              htmlFor="cvc"
              className="floating-label font-extrabold absolute left-4 -top-4 px-4 bg-white text-black-100 transition-all duration-200 pointer-events-none font-courierPrime text-[16px]
              xms:text-[20px] xl:text-[24px] xxs:text-[15px] "
            >
              CVC Number
            </label>
            <CardCvcElement
              id="cvc"
              options={options}
              onChange={handleCardCvcChange}
              className="w-full px-4 lg:pt-[0.8rem] pt-3 md:pt-3 xl:pt-7 h-[42px] font-light placeholder-gray-400 rounded-xl border border-gray-500 focus:outline-none focus:ring-0 text-[16px] font-courierPrime
              xms:px-7 xms:h-[40px] xms:text-[18px]
              xl:h-[72px] xl:text-[24px] py-5"
            />
          </div>
          {/* Expiration */}
          <div className="relative mt-7 mb-5 lg:mb-[1.25rem]w-full">
            <label
              htmlFor="expiryDate"
              className="floating-label font-extrabold absolute left-4 -top-4 px-4 bg-white text-black-100 transition-all duration-200 pointer-events-none font-courierPrime text-[16px]
              xms:text-[20px] xl:text-[24px] xxs:text-[15px]"
            >
              Expiry Date
            </label>
            <CardExpiryElement
              id="expiryDate"
              options={options}
              onChange={handleExpiryChange}
              className="w-full px-4 lg:pt-[0.8rem] pt-3 md:pt-3 xl:pt-7 h-[42px] font-light placeholder-gray-400 rounded-xl border border-gray-500 focus:outline-none focus:ring-0 text-[16px] font-courierPrime
               xms:px-7 xms:h-[40px] xms:text-[18px]
               xl:h-[72px] xl:text-[24px] py-5"
            />
          </div>
        </div>
        {/* Email */}
        <div className="relative mt-7 mb-5 lg:mb-[1.75rem] w-full">
          <input
            type="email"
            id="email"
            disabled
            className="
        w-full px-4 xl:pt-2 lg:pt-[0.5rem] h-[44px]   font-light placeholder-gray-400 rounded-xl border border-[#BEBCBC] focus:outline-none focus:ring-0 font-courierPrime text-sm lg:h-[44px]
        xms:px-7  xms:h-[40px] xms:text-[18px]
        xl:h-[72px] xl:text-[24px]"
            placeholder="johndoe@gmail.com"
            autoComplete="off"
            value={session?.user?.email}
          />
          <label
            htmlFor="email"
            className="
          floating-label font-extrabold absolute left-4 -top-4 px-4 bg-white text-black-100 transition-all duration-200 pointer-events-none font-courierPrime text-[16px] placeholder-black-100
          xms:text-[20px]  xl:text-[24px] xxs:text-[15px]"
          >
            Email Address
          </label>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading || isCardCvcEmpty || isCardExpiryEmpty || isCardNumberEmpty}
          className=" rounded-3xl bg-gradient-to-r from-orange-100 to-orange-200  w-full py-2 lg:py-4 text-slate-50 font-courier-prime text-[18px] font-courierPrime 
       "
        >
          Pay Now
        </button>
        <span className="text-[red]">
          {loading ? "Please wait while we process your request" : ""}
        </span>
      </form>
    </>
  );
};
export default StripePaymentForm;
