/* eslint-disable no-useless-escape */
import toast from "react-hot-toast";
import { authenticate } from "../helper/helper.js";

/** Validate login page username */
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  if (values.username) {
    const { status } = await authenticate(values.username);
    if (parseInt(status) !== 200) {
      errors.exist = toast.error("Username doesn't exist...!");
    }
  }
  return errors;
}
/** Validate password */
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}
/** Validate Register form */
export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

/** validate profile page */
export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}

/** Validate resetpassword */
export async function resetPasswordValidate(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_pwd)
    errors.exist = toast.error(
      "Password and confirm password must be same...!"
    );
  return errors;
}

/** validate username */
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username is required...!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username...!");
  }
  return error;
}

const specialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

/** validate username */
function passwordVerify(error = {}, values) {
  if (!values.password) {
    error.username = toast.error("Password is required...!");
  } else if (values.password.includes(" ")) {
    error.username = toast.error("Invalid Password...!");
  } else if (values.password.length < 4) {
    error.username = toast.error(
      "Password must be more than 4 characters long...!"
    );
  } else if (!specialCharacter.test(values.password)) {
    error.username = toast.error("Password must have special character..!");
  }
  return error;
}

/** validate email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}
