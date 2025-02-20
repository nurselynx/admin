import CryptoJS from "crypto-js";

export const encryptData = (data: string, secretKey: any) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (encryptedData: string, secretKey: any): any => {
  if (encryptedData?.length > 0) {
    try {
      // Decrypt the data
      const data = encryptedData ? encryptedData : "";
      const bytes = CryptoJS.AES.decrypt(data, secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    } catch (error) {
      console.log(error);
    }
  }
};
