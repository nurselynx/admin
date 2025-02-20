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
import { ValidateFile } from "./secure";
// Define the shape of the form data
interface ContactInformationFormData {
  serviceOneTitle: string;
  serviceOneDescription: string;
  serviceTwoTitle: string;
  serviceTwoDescription: string;
  serviceThreeTitle: string;
  serviceThreeDescription: string;
  heading: string;
  subheading: string;
  icon1: any;
  icon?: any;
  icon2: any;
}

const createFieldValidation1 = (fieldName: any, max: number) =>
  yup
    .string()
    .required(`${fieldName} is required`)
    .matches(/^[^\s]/, `Avoid starting spaces`)
    .max(max, `Char Limit: ${max}`);

const validationSchema = yup.object().shape({
  heading: createFieldValidation1("Title", 24),
  subheading: createFieldValidation1("Description", 50),
  serviceOneTitle: createFieldValidation1("Title", 25),
  serviceOneDescription: createFieldValidation1("Description", 65),
  serviceTwoTitle: createFieldValidation1("Title", 25),
  serviceTwoDescription: createFieldValidation1("Description", 65),
  serviceThreeTitle: createFieldValidation1("Title", 25),
  serviceThreeDescription: createFieldValidation1("Description", 65),
});
interface ContactInformationProps {
  getData: {
    id?: string;
    heading?: string;
    subheading?: string;
    serviceOne?: {
      serviceOneTitle?: string;
      serviceOneDescription?: string;
      icon1?: any;
    };
    serviceTwo?: {
      serviceTwoTitle?: string;
      serviceTwoDescription?: string;
      icon2?: any;
    };
    serviceThree?: {
      serviceThreeTitle?: string;
      serviceThreeDescription?: string;
      icon3?: any;
    };
  };
}

const OurServices: React.FC<ContactInformationProps> = ({ getData }) => {
  const iconOne = getData?.serviceOne?.icon1?.original_url;
  const iconTwo = getData?.serviceTwo?.icon2?.original_url;
  const iconThree = getData?.serviceThree?.icon3?.original_url;
  // Validation schema using Yup

  const router = useRouter();
  const cookieValue = getCookie("dataUser");
  const userData = cookieValue ? JSON.parse(cookieValue as string) : null;
   const [fileUploadCheck, setFileUploadCheck] = useState<boolean>(false); 
   const [fileUploadCheck1, setFileUploadCheck1] = useState<boolean>(false); 
   const [fileUploadCheck2, setFileUploadCheck2] = useState<boolean>(false); 
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
    setValue,
    getValues,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });
  const values = getValues(); // Get all form values
  const handleFieldChange = (fieldName: keyof ContactInformationFormData) => {
    clearErrors(fieldName); // Clear error for the specified field
  };
  const onSubmit: SubmitHandler<ContactInformationFormData> = async (data) => {
      if (fileUploadCheck && !ValidateFile(values?.icon, "service one")) return;
      if (fileUploadCheck1 &&  !ValidateFile(values?.icon1, "service two")) return;
      if (fileUploadCheck2  && !ValidateFile(values?.icon2, "service three")) return;
    const {
      heading,
      subheading,
      icon,
      serviceOneTitle,
      serviceOneDescription,
      icon1,
      serviceTwoTitle,
      serviceTwoDescription,
      icon2,
      serviceThreeTitle,
      serviceThreeDescription,
      ...cleanedData
    } = data;

    const fileUploadFormat = new FormData();
    fileUploadCheck ? fileUploadFormat.append("icon1", values?.icon) : null;
    fileUploadCheck1  ? fileUploadFormat.append("icon2", values?.icon1) : null;
    fileUploadCheck2 ? fileUploadFormat.append("icon3", values?.icon2) : null;

    try {
      const uploadResponse = await uploadFile(
        fileUploadFormat,
        getCookie("authToken")
      );
      if (uploadResponse?.status === 201) {
        const formattedData = {
          ...cleanedData,
          section: "our services",
          userId: userData?.id,
          sectionDetail: {
            heading: data?.heading,
            subheading: data?.subheading,
            serviceOne: {
              serviceOneTitle,
              serviceOneDescription,
              icon1: uploadResponse?.data?.items?.icon1
                ? uploadResponse?.data?.items?.icon1
                : iconOne,
            },
            serviceTwo: {
              serviceTwoTitle,
              serviceTwoDescription,
              icon2: uploadResponse?.data?.items?.icon2
                ? uploadResponse?.data?.items?.icon2
                : iconTwo,
            },
            serviceThree: {
              icon3: uploadResponse?.data?.items?.icon3
                ? uploadResponse?.data?.items?.icon3
                : iconThree,
              serviceThreeTitle,
              serviceThreeDescription,
            },
          },
        };

        const response = await updateProfile(
          formattedData,
          getCookie("authToken")
        );

        if (response?.status === 201) {
          router.refresh();
          toast.success("The services has been submitted successfully.");
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const styleComman = "flex items-start gap-4 w-full xl:flex-wrap";
  useEffect(() => {
    if (getData) {
      reset({
        heading: getData?.heading || "",
        subheading: getData?.subheading || "",
        serviceOneTitle: getData?.serviceOne?.serviceOneTitle || "",
        serviceOneDescription: getData?.serviceOne?.serviceOneDescription || "",
        serviceTwoTitle: getData?.serviceTwo?.serviceTwoTitle || "",
        serviceTwoDescription: getData?.serviceTwo?.serviceTwoDescription || "",
        serviceThreeTitle: getData?.serviceThree?.serviceThreeTitle || "",
        serviceThreeDescription:
          getData?.serviceThree?.serviceThreeDescription || "",
      });
    }
  }, [getData, reset]);

  return (
    <div className="mt-4 bg-white w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className={styleComman}>
          <InputField
            label="Main Heading"
            id="heading"
            type="text"
            placeholder="Enter Heading"
            register={register}
            errors={errors}
            validationKey="heading"
            onChange={() => handleFieldChange("heading")}
          />
          <InputField
            label="Sub Heading"
            id="subheading"
            type="text"
            placeholder="Enter Sub Heading"
            register={register}
            errors={errors}
            validationKey="subheading"
            onChange={() => handleFieldChange("subheading")}
          />
        </div>

        <h2 className=" font-medium mt-6"> Service One</h2>
        <FileUploadField
          label="Upload Icon"
          id="icon"
          register={register}
          errors={errors}
          validationKey="icon"
          onChange={() => handleFieldChange("icon")}
          setValue={setValue} // Pass setValue here
          values={
            values?.icon?.name || getData?.serviceOne?.icon1?.original_url
          }
          setFileUploadCheck={setFileUploadCheck}
          isProfileUpload={true}
        />
        <div className={styleComman}>
          <InputField
            label="Title"
            id="serviceOneTitle"
            type="text"
            placeholder="Enter Service One Title"
            register={register}
            errors={errors}
            validationKey="serviceOneTitle"
            onChange={() => handleFieldChange("serviceOneTitle")}
          />
          <InputField
            label="Description"
            id="serviceOneDescription"
            type="text"
            placeholder="Enter Service One Description"
            register={register}
            errors={errors}
            validationKey="serviceOneDescription"
            onChange={() => handleFieldChange("serviceOneDescription")}
          />
        </div>

        <h2 className=" font-medium mt-6"> Service Two</h2>
        <FileUploadField
          label="Upload Icon"
          id="icon1"
          register={register}
          errors={errors}
          validationKey="icon1"
          onChange={() => handleFieldChange("icon1")}
          setFileUploadCheck1={setFileUploadCheck1}
          setValue={setValue} // Pass setValue here
          isProfileUpload={true}
          values={
            values?.icon1?.name || getData?.serviceTwo?.icon2?.original_url
          }
        />
        <div className={styleComman}>
          <InputField
            label="Title"
            id="serviceTwoTitle"
            type="text"
            placeholder="Enter Service Two Title"
            register={register}
            errors={errors}
            validationKey="serviceTwoTitle"
            onChange={() => handleFieldChange("serviceTwoTitle")}
          />
          <InputField
            label="Description"
            id="serviceTwoDescription"
            type="text"
            placeholder="Enter Service Two Description"
            register={register}
            errors={errors}
            validationKey="serviceTwoDescription"
            onChange={() => handleFieldChange("serviceTwoDescription")}
          />
        </div>

        <h2 className=" font-medium mt-6"> Service Three</h2>
        <FileUploadField
          label="Upload Icon"
          id="icon2"
          register={register}
          errors={errors}
          validationKey="icon2"
          onChange={() => handleFieldChange("icon2")}
          setValue={setValue} // Pass setValue here
          setFileUploadCheck2={setFileUploadCheck2}
          isProfileUpload={true}
          values={
            values?.icon2?.name || getData?.serviceThree?.icon3?.original_url
          }
        />

        <div className={styleComman}>
          <InputField
            label="Title"
            id="serviceThreeTitle"
            type="text"
            placeholder="Enter Service Three Title"
            register={register}
            errors={errors}
            validationKey="serviceThreeTitle"
            onChange={() => handleFieldChange("serviceThreeTitle")}
          />
          <InputField
            label="Description"
            id="serviceThreeDescription"
            type="text"
            placeholder="Enter Service Three Description"
            register={register}
            errors={errors}
            validationKey="serviceThreeDescription"
            onChange={() => handleFieldChange("serviceThreeDescription")}
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

export default OurServices;
