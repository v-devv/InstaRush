import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useController, useForm } from "react-hook-form";


const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext()

    const [state, setState] = useState("login");

    const { register, handleSubmit, reset,control, setError, formState: { errors } } = useForm();

    const onSubmitHandler = async (formData) => {
        try {
            const { data } = await axios.post(`/api/user/${state}`, formData );
            console.log(data, "login  data");

            if (data.success) {
                navigate('/');
                setUser(data.user);
                setShowUserLogin(false);
                toast.success(data.message);
                reset();
                window.location.reload();
            } else {
                //  Show field-specific error for email
                if (state === "register" && data.message === "User already exists") {
                    setError("email", {
                        type: "manual",
                        message: "Email already exists",
                    });
                } else if (state === "login" && data.message === "Invalid credentials") {
                    setError('password' , {
                        type: "manual",
                        message: "Invalid email or password",
                    })
                }
            }
        } catch (error) {
            // In case of server error
            toast.error(error.message );
        }
    };
    const {
  field: passwordField,
} = useController({
  name: "password",
  control,
  rules: state === "register"
    ? {
        required: "Password is required",
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
          message:
            "Password must be at least 8 characters and include upper, lower, number, special character",
        },
      }
    : {
        required: "Password is required",
      },
});
    useEffect(() => {
  reset(); // Clears field values and errors when switching state
}, [state]);

    return (
        <div onClick={() => setShowUserLogin(false)} className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50">
            <form key={state} onSubmit={handleSubmit(onSubmitHandler)} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-purple-500">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input {...register('name', { required: " Name is required", validate: (val) => val.trim() !== '' || 'Name is required' })} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-500" type="text" />
                        {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>)}
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input {...register('email', {
                        required: "Email is required", pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                        },
                    })} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-500" type="text" />
                    {errors.email && (<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>)}
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input
                         {...passwordField}
                        autoComplete={state === "login" ? "current-password" : "new-password"}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-500"
                        type="password"
                    />

                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}

                </div>
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-purple-500 cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-purple-500 cursor-pointer">click here</span>
                    </p>
                )}
                <button className="bg-purple-500 hover:bg-purple-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
};
export default Login;