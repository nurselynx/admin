import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

// Define types for the parameters and response data
type Method = "get" | "getById" | "post" | "put" | "delete";

interface UseAxiosParams {
  url: string;
  method: Method;
  isUser?: boolean;
}

const useAxios = ({ url, method }: UseAxiosParams) => {
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [data, setData] = useState<any>(null); // Type for data can be adjusted based on expected response
  const [error, setError] = useState<string>("");
  const [errorCsv, setErrorCsv] = useState<string | null>(""); // Assuming errors can be string or null
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const makeRequest = async (
    requestData: any,
    token: any
  ): Promise<AxiosResponse<any>> => {
    setLoading(true);
    setError("");
    try {
      let response: AxiosResponse<any>;

      switch (method) {
        case "get":
          response = await axios.get(`${apiBaseURL}${url}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          break;

        case "getById":
          response = await axios.get(
            `${apiBaseURL}${url}${requestData?.id || ""}`,
            {
              headers: {
                Authorization: `${token || ""}`,
              },
            }
          );
          break;

        case "post":
          response = await axios.post(`${apiBaseURL}${url}`, requestData, {
            headers: {
              Authorization: `${token || ""}`,
            },
          });
          break;

        case "put":
          response = await axios.put(`${apiBaseURL}${url}`, requestData, {
            headers: {
              Authorization: `${token || ""}`,
            },
          });
          break;

        case "delete":
          response = await axios.delete(`${apiBaseURL}${url}`, {
            headers: {
              Authorization: `${token || ""}`,
            },
            data: requestData, // Include requestData here
          });
          break;

        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(response.data);
      return response;
    } catch (error: any) {
      setError(error?.response?.data?.message || "An error occurred");
      setErrorCsv(error?.response?.data?.errors || "");
      if (
        error?.response?.data?.code === 400 &&
        error?.response?.data?.message?.includes("session has expired")
      ) {
        router.push("/auth/sign-in");
      }
      throw error; // Rethrow the error to be handled elsewhere if needed
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, makeRequest, setError, errorCsv, setErrorCsv };
};

export default useAxios;
