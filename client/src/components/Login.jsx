import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useController, useForm } from "react-hook-form";

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("login");
  const [otpMode, setOtpMode] = useState(false);
  const [verifyOtpMode, setVerifyOtpMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const emailValue = watch("email");

  // SEND OTP
  const sendOtpHandler = async () => {
    const valid = await trigger("email");
    if (!valid) return;

    try {
      setLoading(true);

      const { data } = await axios.post("/api/user/login-with-otp", {
        email: emailValue,
      });

      if (data.success) {
        toast.success("OTP sent to your email");
        setVerifyOtpMode(true);
      }
    } catch (error) {
      if (
        error.response ||
        data.message === "OTP already sent. Please try again later"
      ) {
        setVerifyOtpMode(true);
      } else {
        toast.error("Failed to send OTP");
      }
    }

    setLoading(false);
  };

  // VERIFY OTP
  const verifyOtpHandler = async () => {
    const otp = watch("otp");

    if (!otp) {
      setError("otp", {
        type: "manual",
        message: "OTP required",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/user/verify-otp", {
        email: emailValue,
        otp,
      });

      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
        toast.success(data.message);

        navigate("/");
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
      }
      setError("otp", {
        type: "manual",
        message: error.response.data.message,
      });
      toast.error("OTP verification failed");
    }

    setLoading(false);
  };

  // LOGIN / REGISTER
  const onSubmitHandler = async (formData) => {
    try {
      setLoading(true);

      const { data } = await axios.post(`/api/user/${state}`, formData);

      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
        toast.success(data.message);

        navigate("/");
        window.location.reload();
      } else {
        if (state === "register" && data.message === "User already exists") {
          setError("email", {
            type: "manual",
            message: "Email already exists",
          });
        }

        if (state === "login" && data.message === "Invalid credentials") {
          setError("password", {
            type: "manual",
            message: "Invalid email or password",
          });
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  const { field: passwordField } = useController({
    name: "password",
    control,
    rules:
      state === "register"
        ? {
            required: "Password required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
              message:
                "Password must include uppercase, lowercase, number and special character",
            },
          }
        : !otpMode
          ? { required: "Password required" }
          : {},
  });

  useEffect(() => {
    reset();
  }, [state, otpMode]);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 text-sm text-gray-600">
      <form
        key={state}
        onSubmit={handleSubmit(onSubmitHandler)}
        className="relative flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* CLOSE BUTTON */}
        {!otpMode && (
          <button
            type="button"
            onClick={() => setShowUserLogin(false)}
            className="absolute top-3 right-4 text-lg text-gray-500 hover:text-black cursor-pointer hover:scale-110  transition-transform "
          >
            ✕
          </button>
        )}

        {/* BACK BUTTON */}
        {otpMode && (
          <button
            type="button"
            onClick={() => {
              setOtpMode(false);
              setVerifyOtpMode(false);
              reset();
            }}
            className="text-sm text-purple-500 cursor-pointer absolute top-3 left-4 hover:scale-110 transition-transform"
          >
            ← Back
          </button>
        )}

        <p className="text-2xl font-medium text-center">
          <span className="text-purple-500">User</span>{" "}
          {verifyOtpMode
            ? "Verify OTP"
            : otpMode
              ? "Login with OTP"
              : state === "login"
                ? "Login"
                : "Sign Up"}
        </p>

        {/* NAME */}
        {state === "register" && (
          <div>
            <p>Name</p>

            <input
              {...register("name", { required: "Name required" })}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />

            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
        )}

        {/* EMAIL */}
        <div>
          <p>Email</p>

          <input
            {...register("email", {
              required: "Email required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
            disabled={verifyOtpMode}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100"
          />

          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        {!otpMode && !verifyOtpMode && (
          <div>
            <p>Password</p>

            <input
              {...passwordField}
              type="password"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />

            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
        )}

        {/* OTP */}
        {verifyOtpMode && (
          <div>
            <p className="text-xs text-gray-500 mb-1">
              OTP sent to <span className="font-medium">{emailValue}</span>
            </p>

            <input
              {...register("otp", {
                required: "OTP required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "OTP must be 6 digits",
                },
              })}
              maxLength="6"
              placeholder="------"
              className="border border-gray-200 rounded w-full p-2 mt-1 text-center tracking-[10px] text-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />

            {errors.otp && (
              <p className="text-red-500 text-xs">{errors.otp.message}</p>
            )}
          </div>
        )}

        {/* LOGIN / REGISTER SWITCH */}
        {!otpMode && !verifyOtpMode && (
          <>
            {state === "register" ? (
              <p>
                Already have account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-purple-500 cursor-pointer"
                >
                  click here
                </span>
              </p>
            ) : (
              <p>
                Create an account?{" "}
                <span
                  onClick={() => setState("register")}
                  className="text-purple-500 cursor-pointer"
                >
                  click here
                </span>
              </p>
            )}
          </>
        )}

        {/* LOGIN / REGISTER BUTTON */}
        {!otpMode && !verifyOtpMode && (
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white w-full py-2 rounded-md cursor-pointer"
          >
            {loading
              ? "Loading..."
              : state === "register"
                ? "Create Account"
                : "Login"}
          </button>
        )}

        {/* SEND OTP */}
        {otpMode && !verifyOtpMode && (
          <button
            type="button"
            onClick={sendOtpHandler}
            className="bg-purple-500 hover:bg-purple-600 text-white w-full py-2 rounded-md cursor-pointer"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {/* VERIFY OTP */}
        {verifyOtpMode && (
          <button
            type="button"
            onClick={verifyOtpHandler}
            className="bg-purple-500 hover:bg-purple-600 text-white w-full py-2 rounded-md cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}

        {/* OTP OPTION */}
        {state === "login" && !otpMode && !verifyOtpMode && (
          <>
            <div className="flex items-center w-full my-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-xs text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button
              type="button"
              onClick={() => setOtpMode(true)}
              className="border border-purple-500 text-purple-500 hover:bg-purple-50 w-full py-2 rounded-md cursor-pointer"
            >
              Login with OTP
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
