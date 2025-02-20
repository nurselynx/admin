export const formatPhoneNumber = (phoneNumber: string) => {
  const match = phoneNumber?.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber;
};
