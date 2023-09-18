'use client'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/stripePaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);
export default function Home() {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <PaymentForm orderNo={undefined} toPay={undefined} credit={undefined} handleLoadingChange={undefined}/>
      </Elements>
    </div>
  );
}
