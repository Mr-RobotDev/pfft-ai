
const CryptoJS = require("crypto-js");
export function generateUniqueString(id: string) {
  const randomNumber = Math.floor(Math.random() * 100).toString();
  const dateString = new Date().toString();
  return randomNumber + id + dateString;
}

export function toCents(amount: number) {
  return Math.round(amount * 100);
}
export function toDollars(amount: number) {
  return amount / 100;
}
export function encryptKey(key: string) {
  const encJson = CryptoJS.AES.encrypt(
    JSON.stringify(key),
    process.env.ENCRYPT_PRIVATE_KEY
    , {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  ).toString();
  const encData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encJson)
  );
  return encData;
}

export function decryptKey(encryptedKey: string) {
  const decData = CryptoJS.enc.Base64.parse(encryptedKey).toString(
    CryptoJS.enc.Utf8
  );
  const bytes = CryptoJS.AES.decrypt(
    decData,
    process.env.ENCRYPT_PRIVATE_KEY
  ).toString(CryptoJS.enc.Utf8);
  return JSON.parse(bytes);
}

export function calculatePayment(selectedOption: string) {
  if (selectedOption === "1000") {
    const vatValue = (
      (Number(process.env.VAT_TAX) *
        Number(process.env.MONTHLY_PAYMENT_AMOUNT_1000_CREDIT)) /
      100
    ).toString();
    const ToPay = (parseFloat(
      process.env.MONTHLY_PAYMENT_AMOUNT_1000_CREDIT as unknown as string
    ) + parseFloat(vatValue as string)) as any;
    return { vatValue: vatValue, ToPay: ToPay };
  } else {
    const vatValue = (
      (Number(process.env.VAT_TAX) *
        Number(process.env.MONTHLY_PAYMENT_AMOUNT_2000_CREDIT)) /
      100
    ).toString();
    const ToPay = (parseFloat(
      process.env.MONTHLY_PAYMENT_AMOUNT_2000_CREDIT as unknown as string
    ) + parseFloat(vatValue as string)) as any;
    return { vatValue: vatValue, ToPay: ToPay };
  }
}

export function toRegularDate(date: string): string  {
  const dateObject = new Date(date);

  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();
  const year = dateObject.getFullYear();

  return `${month}/${day}/${year}`;
}

export async function createShortUrl(link:string) {
  try {
    const response = await fetch(`/api/createShortLink?link=${link}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to create short URL");
    }

    const data = await response.json();
    return data.shortUrl;
    
  } catch (error) {
    console.error(error);
    //throw new Error("An error occurred while creating the short URL");
  }
}

export async function getDestination(hash:string) {
  try {
    const response = await fetch(`/api/getShortLink?hash=${encodeURIComponent(hash)}`, {
      method: "GET",
    });

    if (!response.ok) {
        console.log("Failed to fetch destination");
    }

    const data = await response.json();

    return data.destination;
  } catch (error) {
   console.error(error); 
 }
}