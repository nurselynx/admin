import * as yup from "yup";

export const clientHistoryValidationSchema = yup.object().shape({
    name: yup.string().required("Client name is required"),
  // name: yup.string().notRequired(),
  address: yup.string().required("Street Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pincode: yup.string().required("Pincode is required"),
  lat: yup.string().required("Latitude is required"),
  lon: yup.string().required("Longitude is required"),
});
