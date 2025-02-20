import React, {useEffect} from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./inputField";
import useAxios from "@/hooks/useAxios";
import { ADMIN_CMS_DETAILS } from "@/constants/api";

// Define the shape of the form data
interface ContactInformationFormData {
  title: string;
  description: string;
}
const createFieldValidation1 = (fieldName: any, max: number) =>
  yup
    .string()
    .required(`${fieldName} is required`)
    .matches(/^[^\s]/, `Avoid starting spaces`)
    .max(max, `Char Limit: ${max}`);

// Validation schema using Yup
const validationSchema = yup.object().shape({
  title: createFieldValidation1("Title", 65),
  description: createFieldValidation1("Description", 110),
});

// Define the props for the component
interface ContactInformationProps {
  getData: {
    id?: string;
    title?: string;
    description?: string;
  };
}

const HeroSection: React.FC<ContactInformationProps> = ({ getData }) => {
  const router = useRouter();
  const cookieValue = getCookie("dataUser");
  const userData = cookieValue ? JSON.parse(cookieValue as string) : null;

  const { makeRequest: updateProfile, loading } = useAxios({
    url: ADMIN_CMS_DETAILS,
    method: "post",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset
  } = useForm<ContactInformationFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: getData?.title || "",
      description: getData?.description || "",
    },
  });

  const handleFieldChange = (fieldName: keyof ContactInformationFormData) => {
    clearErrors(fieldName); // Clear error for the specified field
  };

  const onSubmit: SubmitHandler<ContactInformationFormData> = async (data) => {
    const { title, description, ...cleanedData } = data;
    const formattedData = {
      ...cleanedData,
      userId: userData?.id,
      section:"hero section",
      sectionDetail: {
        title: data?.title,
        description: data?.description,
      },
    };
    try {
      const response = await updateProfile(
        formattedData,
        getCookie("authToken")
      );
      if (response?.status === 201) {
        router.refresh();
        toast.success("The hero section details submitted successfully.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const styleComman = "flex items-start gap-4 w-full xl:flex-wrap";

  useEffect(() => {
    if (getData) {
      reset({
        title: getData?.title || "",
        description: getData?.description || "",
      });
    }
  }, [getData, reset]);

  return (
    <div className="mt-4 bg-white w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={styleComman}>
          <InputField
            label="Title"
            id="title"
            type="text"
            placeholder="Enter Hero Section Title"
            register={register}
            errors={errors}
            validationKey="title"
            onChange={() => handleFieldChange("title")}
          />
          <InputField
            label="Description"
            id="description"
            type="text"
            placeholder="Enter Hero Section description"
            register={register}
            errors={errors}
            validationKey="description"
            onChange={() => handleFieldChange("description")}
          />
        </div>
        <hr className="mt-12 block" />
        <button
          type="submit"
          disabled={loading}
          className="w-[167px] ml-auto block bg-lynx-blue-100 text-white py-2 px-4 rounded-md"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default HeroSection;
