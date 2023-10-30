const validateEmail = (email: string): boolean => {
  const emailValidationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return emailValidationRegex.test(email);
};

export default validateEmail;
