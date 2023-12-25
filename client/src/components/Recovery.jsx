import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import { generateOTP, verifyOTP } from "../helper/helper";
import { passwordValidate } from "../helper/validate";
import { useAuthStore } from "../store/store.js";
import style from "../styles/Username.module.css";

const Recovery = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) return toast.success("OTP has been send to your email!");
      return toast.error("Problem while generating OTP");
    });
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 200) {
        toast.success("Verify Successfully!");
        return navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong OTP! Check email again!");
    }
  };

  function resendOTP() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "Sending...",
      success: <b>OTP has been sent to your email!</b>,
      error: <b>Could not send it! </b>,
    });
    sendPromise.then((otp) => {
      // console.log(otp);
    });
  }
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={style.glass} style={{ width: "50%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again</h4>
            <span className="py-4 text-xl  w-2/3 text-center text-gray-500">
              Explore more with us
            </span>
          </div>

          <form className="pt-20" onSubmit={handleSubmit}>
            <div className="textbox flex flex-col items-center gap-y-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP to your email address.
                </span>
                <input
                  type="password"
                  className={style.textbox}
                  placeholder="OTP"
                  onChange={(e) => setOTP(e.target.value)}
                />
              </div>

              <button type="submit" className={style.btn}>
                Sign In
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Can't get OTP?
                <Link
                  to="/recovery"
                  className="text-red-500 ml-1"
                  onClick={resendOTP}
                >
                  Resend
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
