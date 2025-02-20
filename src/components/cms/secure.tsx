import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./inputField";
import useAxios from "@/hooks/useAxios";
import { ADMIN_CMS_DETAILS, UPLOAD } from "@/constants/api";
import FileUploadField from "./fileUploadField";

// Define the shape of the form data
interface ContactInformationFormData {
  title: string;
  description: string;
  icon?: any;
}
export const ValidateFile = (file: File, fieldTitle?: string) => {
  const allowedTypes = ["image/png", "image/jpeg"];
  const maxSize = 20 * 1024; // 20KB

  if (!allowedTypes.includes(file?.type)) {
    toast.error(`Please upload ${fieldTitle || ""} PNG, JPG, image.`);
    return false;
  }

  if (file.size > maxSize) {
    toast.error(`The ${fieldTitle} image size must be less than 20KB.`);
    return false;
  }

  return true;
};

const createFieldValidation1 = (fieldName: any, max: number) =>
  yup
    .string()
    .required(`${fieldName} is required`)
    .matches(/^[^\s]/, `Avoid starting spaces`)
    .max(max, `Char Limit: ${max}`);

// Validation schema using Yup
const validationSchema = yup.object().shape({
  title: createFieldValidation1("Title", 65),
  description: createFieldValidation1("Description", 152),
});

// Define the props for the component
interface ContactInformationProps {
  getData: {
    id?: string;
    title?: string;
    description?: string;
    icon?: any;
  };
}

const Secure: React.FC<ContactInformationProps> = ({ getData }) => {
  const router = useRouter();
  const cookieValue = getCookie("dataUser");
  const userData = cookieValue ? JSON.parse(cookieValue as string) : null;
  const [fileUploadCheck, setFileUploadCheck] = useState<boolean>(false); 

  const { makeRequest: updateProfile, loading } = useAxios({
    url: ADMIN_CMS_DETAILS,
    method: "post",
  });

  const { makeRequest: uploadFile, loading: isLoding } = useAxios({
    url: UPLOAD,
    method: "post",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
    reset,
  } = useForm<ContactInformationFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: getData?.title || "",
      description: getData?.description || "",
      icon: getData?.icon?.original_url || null,
    },
  });
  const values = getValues(); // Get all form values
  const handleFieldChange = (fieldName: keyof ContactInformationFormData) => {
    clearErrors(fieldName); // Clear error for the specified field
  };

  const onSubmit: SubmitHandler<ContactInformationFormData> = async (data) => {
   if (fileUploadCheck && !ValidateFile(values?.icon)) return;
    const { title, description, icon, ...cleanedData } = data;
    const fileUploadFormat = new FormData();
    values?.icon ? fileUploadFormat.append("icon", values?.icon) : null;
    try {
      const uploadResponse = await uploadFile(
        fileUploadFormat,
        getCookie("authToken")
      );
      if (uploadResponse?.status === 201) {
        const formattedData = {
          ...cleanedData,
          userId: userData?.id,
          section: "data secure",
          sectionDetail: {
            title: data?.title,
            description: data?.description,
            icon: uploadResponse?.data?.items?.icon
              ? uploadResponse?.data?.items?.icon
              : getData?.icon?.original_url,
          },
        };
        const response = await updateProfile(
          formattedData,
          getCookie("authToken")
        );
        if (response?.status === 201) {
          router.refresh();
          toast.success("The data secure has been submitted successfully.");
        }
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
        <FileUploadField
          label="Upload Icon"
          id="icon"
          register={register}
          errors={errors}
          validationKey="icon"
          onChange={() => handleFieldChange("icon")}
          setValue={setValue} // Pass setValue here
          values={values?.icon?.name || getData?.icon?.original_url}
          setFileUploadCheck={setFileUploadCheck}
          isProfileUpload={true}
        />
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
          disabled={loading || isLoding}
          className="w-[167px] ml-auto block bg-lynx-blue-100 text-white py-2 px-4 rounded-md"
        >
          {loading || isLoding ? "Please wait..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Secure;
