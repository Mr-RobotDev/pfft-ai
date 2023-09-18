export function validateLogin(values: any) {
  const errors: any = {};

  if (!values.password) {
    errors.password = "Password is Required";
  } else if (values.password.length < 6 || values.password.length > 20) {
    errors.password =
      "Password must be greater than 6 and less than 20 characters";
  } else if (values.password.includes(" ")) {
    errors.password = "Invalid Password";
  }

  // validation for username
  if (!values.username) {
    errors.username = "Username is required";
  } 
  else if (!/^[A-Za-z_]+$/.test(values.username)) {
    errors.username = "Invalid Username";
  } 
  else if (values.username.length < 6 || values.username.length > 20) {
    errors.username = "Username must be between 6 and 20 characters";
  } else if (values.username.includes(" ")) {
    errors.username = "Username cannot contain spaces";
  }

  return errors;
}

export function validateRegister(values: any) {
  const errors: any = {};

  if (!values.email) {
    errors.email = "Email is Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  // validation for password
  if (!values.password) {
    errors.password = "Password is Required";
  } else if (values.password.length < 6 || values.password.length > 20) {
    errors.password =
      "Password must be greater then 6 and less then 20 characters long";
  } else if (values.password.includes(" ")) {
    errors.password = "Invalid Password";
  }

  // validation for username
  if (!values.username) {
    errors.username = "Username is required";
  } 
  else if (!/^[A-Za-z_]+$/.test(values.username)) {
    errors.username = "Invalid Username";
  } 
  else if (values.username.length < 6 || values.username.length > 20) {
    errors.username = "Username must be between 6 and 20 characters";
  } else if (values.username.includes(" ")) {
    errors.username = "Username cannot contain spaces";
  }
  return errors;
}

export function validateChangePassword(values: any) {
  const errors: any = {};

  // validation for password
  if (!values.password) {
    errors.password = "Password is Required";
  } else if (values.password.length > 20) {
    errors.password = "Must be less then 20 characters long";
  } else if (values.password.includes(" ")) {
    errors.password = "Invalid Password";
  }

  // validate new password
  if (!values.npassword) {
    errors.npassword = "Password is Required";
  } else if (values.npassword.length < 6 || values.npassword.length > 20) {
    errors.npassword =
      "Must be greater then 4 and less then 20 characters long";
  } else if (values.npassword.includes(" ")) {
    errors.npassword = "Invalid Password";
  }

  // validate confirm password
  if (!values.cpassword) {
    errors.cpassword = "Required";
  } else if (values.npassword !== values.cpassword) {
    errors.cpassword = "Password Not Match...!";
  } else if (values.cpassword.includes(" ")) {
    errors.cpassword = "Invalid Confirm Password";
  }

  return errors;
}

export function validateForgot(values: any) {
  const errors: any = {};

  if (!values.email) {
    errors.email = "Enter your email address";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
}
