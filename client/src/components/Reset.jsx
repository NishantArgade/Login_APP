import { useFormik } from "formik";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import { resetPassword } from "../helper/helper";
import { resetPasswordValidate } from "../helper/validate";
import useFech from "../hooks/fetch.hook.js";
import { useAuthStore } from "../store/store.js";
import style from "../styles/Username.module.css";

const Reset = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, status, serverError }] =
    useFech("createResetSession");

  // useEffect(() => {
  //   console.log(apiData);
  // }, [apiData]);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd: "",
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const resetPromise = resetPassword({
        username,
        password: values.password,
      });

      toast.promise(resetPromise, {
        loading: "Updating...",
        success: <b>Password Reset Successfully</b>,
        error: <b>Could not Reset!</b>,
      });

      resetPromise.then(() => navigate("/password"));
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return (
      <h1 className="text-xl text-red-500 font-bold">{serverError.message}</h1>
    );
  if (status && status !== 200)
    return <Navigate to={"/password"} replace></Navigate>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={style.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl  w-2/3 text-center text-gray-500">
              Enter new password.
            </span>
          </div>

          <form className="pt-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                type="password"
                className={style.textbox}
                {...formik.getFieldProps("password")}
                placeholder="New Password"
              />
              <input
                type="password"
                className={style.textbox}
                {...formik.getFieldProps("confirm_pwd")}
                placeholder="Repeat Password"
              />
              <button type="submit" className={style.btn}>
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
