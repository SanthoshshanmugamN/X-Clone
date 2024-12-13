import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: async ({ email, username, fullName, password }) => {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, username, fullName, password }),
            });

            // Parse JSON response safely
            const data = await res.json().catch(() => {
                throw new Error("Invalid JSON response");
            });

            if (!res.ok) throw new Error(data.error || "Failed to create account");

            return data;
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            toast.error(error.message || "An error occurred");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        mutate(formData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-screen-xl mx-auto flex h-screen px-10">
            {/* Left Section for SVG */}
            <div className="flex-1 hidden lg:flex items-center justify-center">
                <XSvg className="lg:w-2/3 fill-white" />
            </div>

            {/* Right Section for Form */}
            <div className="flex-1 flex flex-col justify-center items-center">
                <form
                    className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
                    onSubmit={handleSubmit}
                >
                    <XSvg className="w-24 lg:hidden fill-white" />
                    <h1 className="text-4xl font-extrabold text-white">Join today.</h1>

                    {/* Email Input */}
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdOutlineMail />
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                            required
                        />
                    </label>

                    {/* Username and Full Name Inputs */}
                    <div className="flex gap-4 flex-wrap">
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <FaUser />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Username"
                                name="username"
                                onChange={handleInputChange}
                                value={formData.username}
                                required
                            />
                        </label>
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <MdDriveFileRenameOutline />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Full Name"
                                name="fullName"
                                onChange={handleInputChange}
                                value={formData.fullName}
                                required
                            />
                        </label>
                    </div>

                    {/* Password Input */}
                    <label className="input input-bordered rounded flex items-center gap-2">
                        <MdPassword />
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                            required
                        />
                    </label>

                    {/* Submit Button */}
                    <button className="btn rounded-full btn-primary text-white" type="submit">
                        {isLoading ? "Loading..." : "Sign up"}
                    </button>

                    {/* Error Message */}
                    {isError && <p className="text-red-500">{error.message}</p>}
                </form>

                {/* Sign-in Section */}
                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className="text-white text-lg">Already have an account?</p>
                    <Link to="/login">
                        <button className="btn rounded-full btn-primary text-white btn-outline w-full">
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;