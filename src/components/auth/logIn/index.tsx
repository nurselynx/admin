"use client";

import React, { useState } from "react";
import axios from "axios";
import { setCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../inputField/inputField"; // Import the InputField component
import { USER_LOGIN } from "@/constants/api";
import useFcmToken from "@/components/firebase/useFcmToken";
// Interface for props
interface LoginFormProps {
  selectedForm?: string;
}

// Interface for form inputs
interface FormInputs {
  email: string;
  password: string;
}

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginForm: React.FC<LoginFormProps> = () => {
  const { fcmToken: token } = useFcmToken();
  const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const inThirtyDays = new Date();
  inThirtyDays.setDate(inThirtyDays?.getDate() + 30);
  const router = useRouter();
  const [showFields, setShowFields] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: true,
    password: true,
  });
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  // Toggle field visibility
  const toggleFieldVisibility = (field: "email" | "password") => {
    setShowFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const formattedData = {
      ...data,
      fcmToken: token,
      role: "admin",
    };
    setIsLoader(true);
    try {
      const res = await axios.post(`${apiBaseURL}${USER_LOGIN}`, formattedData);
      if (res?.data?.users?.role) {
        setCookie("refreshToken", res?.data?.refreshToken, {
          expires: inThirtyDays,
        });
        setCookie("authToken", res?.data?.token, { expires: inThirtyDays });
        setCookie("dataUser", res?.data.users, { expires: inThirtyDays });
        toast.success("Login successful! Welcome back!");
        router.push("/dashboard");
        router.refresh();
        setIsLoader(false);
      } else {
        toast.error("Something went wrong. Please try again.");
        setIsLoader(false);
      }
    } catch (error: any) {
      setIsLoader(false);
      if (error.response) {
        toast.error(`${error?.response?.data?.error || "Login failed"}`);
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
      <InputField
        label="Email ID"
        id="email"
        type={showFields.email ? "email" : "password"}
        placeholder="Enter Email ID"
        register={register}
        errors={errors}
        validationKey="email"
        showInput={showFields.email}
        toggleVisibility={() => toggleFieldVisibility("email")}
        isEyeShow={true}
      />

      <InputField
        label="Password"
        id="password"
        type={showFields.password ? "text" : "password"}
        placeholder="Enter Password"
        register={register}
        errors={errors}
        validationKey="password"
        showInput={showFields.password}
        toggleVisibility={() => toggleFieldVisibility("password")}
        isEyeShow={true}
      />

      <button
        type="submit"
        disabled={isLoader}
        className="w-full bg-lynx-blue-100 text-white py-2 px-4 rounded-md"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
