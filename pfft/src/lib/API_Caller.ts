// import { APICallerOptions } from "@/models/APICaller.types";

// async function APICaller({
//   body,
//   URL,
//   method,
// }: APICallerOptions): Promise<any> {

//   let options;
//   if (method === "GET") {
//     options = {
//       endpoint: URL,
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//       }
//     };
//   } else {
//     options = {
//       endpoint: URL,
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ body }),
//     };
//   }
//   try {
    
//     const data = await fetch(URL, options).then((response) => {
//       return response.json();
//     });
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// }
// export default APICaller;
import { APICallerOptions } from "@/models/APICaller.types";

async function APICaller({
  body,
  URL,
  method,
}: APICallerOptions): Promise<any> {
  let options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method === "GET") {
    options = {
      ...options,
      method: method,
    };
  } else {
    options = {
      ...options,
      method: method,
      body: JSON.stringify(body),
    };
  }

  try {
    const response = await fetch(URL, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default APICaller;
