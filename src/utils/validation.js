export const validateUserForm = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = "Full Name is required";
  if (!formData.username?.trim()) errors.username = "Username is required";
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email address is invalid";
  }
  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[0-9\s-()]{7,20}$/.test(formData.phone)) {
    errors.phone = "Phone number is invalid";
  }
  if (!formData.website?.trim()) {
    errors.website = "Website is required";
  } else if (
    !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/\S*)?$/.test(
      formData.website
    )
  ) {
    errors.website = "Website URL is invalid";
  }
  if (!formData.company?.name?.trim())
    errors["company.name"] = "Company Name is required";
  if (!formData.company?.catchPhrase?.trim())
    errors["company.catchPhrase"] = "Catch Phrase is required";
  if (!formData.company?.bs?.trim())
    errors["company.bs"] = "Business Service is required";
  if (!formData.address?.full?.trim()) {
    errors["address.full"] = "Full Address is required";
  }
  return errors;
};
