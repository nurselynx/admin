import React, { useState, useEffect } from "react";
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
interface ContactInformationFormData {
  heading: string;
  [key: string]: any;
}

interface ContactInformationProps {
  getData: ContactInformationFormData;
}

const createFieldValidation = (fieldName: string, max: number) =>
  yup
    .string()
    .required(`${fieldName} is required`)
    .matches(/^[^\s]/, `${fieldName} should not start with spaces`)
    .max(max, `${fieldName} must be at most ${max} characters`);

const createValidationSchema = (fieldsCount: number) => {
  const schema: Record<string, yup.Schema<any>> = {
    heading: createFieldValidation("Heading", 40),
  };

  for (let i = 1; i <= fieldsCount; i++) {
    schema[`serviceOneTitle_${i}`] = createFieldValidation(`Title ${i}`, 14);
    schema[`serviceOneDescription_${i}`] = createFieldValidation(
      `Description ${i}`,
      220
    );
    schema[`serviceOneCompany_${i}`] = createFieldValidation(
      `Company ${i}`,
      24
    );
    schema[`icon${i}`] = yup
      .mixed()
      .required(`Icon ${i} is required`)
      .nullable();
  }

  return yup.object().shape(schema);
};

const User: React.FC<ContactInformationProps> = ({ getData }) => {
  const router = useRouter();
  const cookieValue = getCookie("dataUser");
  const userData = cookieValue ? JSON.parse(cookieValue as string) : null;

  const { makeRequest: updateProfile, loading } = useAxios({
    url: ADMIN_CMS_DETAILS,
    method: "post",
  });

  const { makeRequest: uploadFile, loading: isLoding } = useAxios({
    url: UPLOAD,
    method: "post",
  });


  const [serviceFields, setServiceFields] = useState([
    { id: 1, title: "", description: "", company: "", icon: null },
  ]);

  const [validationSchema, setValidationSchema] = useState(
    createValidationSchema(1)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    getValues,
    reset
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const handleFieldChange = (fieldName: string) => {
    clearErrors(fieldName);
  };

  const handleAddField = () => {
    const newField = {
      id: serviceFields.length + 1,
      title: "",
      description: "",
      company: "",
      icon: null,
    };
    setServiceFields((prev) => [...prev, newField]);
    setValidationSchema(createValidationSchema(serviceFields.length + 1));
  };

  const handleRemoveField = (id: number) => {
    setServiceFields((prev) => prev.filter((field) => field.id !== id));
    setValidationSchema(createValidationSchema(serviceFields.length - 1));
  };

  const onSubmit: SubmitHandler<ContactInformationFormData> = async (data) => {
    const { heading, ...fieldData } = data;
    const fileUploadFormat = new FormData();
  
    // Ensure that the actual file is appended
    serviceFields.forEach((field) => {
      if (fieldData[`icon${field.id}`] instanceof File) {
        fileUploadFormat.append(`icon${field.id}`, fieldData[`icon${field.id}`]);
      }
    });
 
    try {
      const uploadResponse = await uploadFile(fileUploadFormat, getCookie("authToken"));
      if (uploadResponse?.status === 201) {
        const formattedData = {
          userId: userData?.id,
          section: "user testimonial",
          sectionDetail: {
            heading,
            services: serviceFields.map((field) => ({
              title: fieldData[`serviceOneTitle_${field.id}`],
              description: fieldData[`serviceOneDescription_${field.id}`],
              company: fieldData[`serviceOneCompany_${field.id}`],
              icon: uploadResponse?.data?.items?.[`icon${field.id}`] || field.icon,
            })),
          },
        };
        const response = await updateProfile(formattedData, getCookie("authToken"));
        if (response?.status === 201) {
          toast.success("The user testimonial has been submitted successfully.");
          router.refresh();
        } else {
          toast.error("Submission failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred. Please check the console.");
    }
  };

  const styleComman = "flex items-start gap-4 w-full xl:flex-wrap mb-5";
  useEffect(() => {
    if (getData?.services) {
      // Populate service fields
      const fields = getData?.services?.map((field:any, index:number) => ({
        id: index + 1,
        title: field.title,
        description: field.description,
        company: field.company,
        icon: field?.icon?.original_url,
      }));
      setServiceFields(fields);

      // Populate form fields
      reset({
        heading: getData.heading,
        ...fields.reduce((acc:any, field:any, index:number) => {
          const id = index + 1;
          acc[`serviceOneTitle_${id}`] = field.title;
          acc[`serviceOneDescription_${id}`] = field.description;
          acc[`serviceOneCompany_${id}`] = field.company;
          acc[`icon${id}`] = field?.icon?.original_url;
          return acc;
        }, {}),
      });

      setValidationSchema(createValidationSchema(fields.length));
    }
  }, [getData, reset]);
  return (
    <div className="mt-4 bg-white w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Heading */}
        <InputField
          label="Heading"
          id="heading"
          type="text"
          placeholder="Enter Heading"
          register={register}
          errors={errors}
          validationKey="heading"
          onChange={() => handleFieldChange("heading")}
        />

        {/* Service Fields */}
        {serviceFields?.map((field) => (
          <div key={field.id}>
            <FileUploadField
              label="Upload Image"
              id={`icon${field.id}`}
              register={register}
              errors={errors}
              validationKey={`icon${field.id}`}
              onChange={() => handleFieldChange(`icon${field.id}`)}
              setValue={setValue}
              values={field.icon ? `icon${field.icon}` : ''}
              className="mb-5"
              placeholder="Please Upload Image"
            />
            <div className={styleComman}>
              <InputField
                label="User Name"
                id={`serviceOneTitle_${field.id}`}
                type="text"
                placeholder="Enter Full Name"
                register={register}
                errors={errors}
                validationKey={`serviceOneTitle_${field.id}`}
                onChange={() =>
                  handleFieldChange(`serviceOneTitle_${field.id}`)
                }
              />
              <InputField
                label="Company Name"
                id={`serviceOneCompany_${field.id}`}
                type="text"
                placeholder="Enter Company Name"
                register={register}
                errors={errors}
                validationKey={`serviceOneCompany_${field.id}`}
                onChange={() =>
                  handleFieldChange(`serviceOneCompany_${field.id}`)
                }
              />
            </div>
            <div className={styleComman}>
              <InputField
                label="Description"
                id={`serviceOneDescription_${field.id}`}
                type="text"
                placeholder="Enter Description"
                register={register}
                errors={errors}
                validationKey={`serviceOneDescription_${field.id}`}
                onChange={() =>
                  handleFieldChange(`serviceOneDescription_${field.id}`)
                }
              />
              <button
                type="button"
                onClick={() => handleRemoveField(field.id)}
                className="bg-red-800 text-white py-1 px-3 h-[46px] mt-7 rounded-md w-full"
              >
                Remove
              </button>
            </div>
            <hr className="my-8" />
          </div>
        ))}

        <hr className="mt-12" />
        <div className="flex items-center justify-end gap-5">
          <button
            type="button"
            onClick={handleAddField}
            className="bg-lynx-blue-100 text-white py-2 px-4 rounded-md"
          >
            Add Testimonial
          </button>
          <button
            type="submit"
            disabled={loading || isLoding}
          className="w-[167px] bg-lynx-blue-100 text-white py-2 px-4 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default User;
