import { useState } from "react";
import CryptoJS from "crypto-js";

function SigninForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmailOrPhone = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10,15}$/;
    return emailPattern.test(value) || phonePattern.test(value);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!username) {
      formErrors.username = "Email or phone number is required";
    } else if (!validateEmailOrPhone(username)) {
      formErrors.username = "Please enter a valid email or phone number.";
    }
    if (!password) {
      formErrors.password = "Password is required";
    } else if (password.length < 4 || password.length > 60) {
      formErrors.password =
        "Your password must contain between 4 and 60 characters.";
    }
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        "your-secret-key"
      ).toString();

      fetch("http://localhost:5001/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password: encryptedPassword }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              try {
                const data = JSON.parse(text);
                throw new Error(data.error || "Unknown error");
              } catch {
                throw new Error(text || "Unknown error");
              }
            });
          }
          return response.text();
        })
        .then((text) => {
          try {
            const data = text ? JSON.parse(text) : {};
            setSuccessMessage("Sign in successful!");
            setErrors({});
            console.log("Success:", data);
          } catch {
            console.log("Success, but no JSON data:", text);
          }
        })
        .catch((error) => {
          if (error.message === "Email already in use") {
            setErrors({ username: "The email address is already in use." });
          } else {
            setErrors({
              general: error.message || "An unknown error occurred",
            });
          }
          setSuccessMessage("");
          console.error("Error:", error.message || error);
        });
    } else {
      setErrors(formErrors);
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[#141414]">
      <div className="w-full max-w-md p-6 bg-[#010505] rounded-lg shadow-md">
        <form action="login-form" onSubmit={handleSubmit}>
          <div className="text-2xl font-bold text-white mb-4">Sign in</div>
          {successMessage && (
            <p className="text-green-500 text-sm mb-4">{successMessage}</p>
          )}
          {errors.general && (
            <p className="text-orange-500 text-sm mb-4">{errors.general}</p>
          )}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              <input
                type="text"
                id="username"
                className="placeholder:text-slate-500 block bg-[#323232] w-full border border-black rounded-md py-3 px-4 shadow-sm focus:outline-none focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="Email or phone number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="text-orange-500 text-sm mt-2">
                  {errors.username}
                </p>
              )}
            </label>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              <input
                type="password"
                id="password"
                className="placeholder:text-slate-500 block bg-[#323232] w-full border border-black rounded-md py-3 px-4 shadow-sm focus:outline-none focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-orange-500 text-sm mt-2">
                  {errors.password}
                </p>
              )}
            </label>
          </div>
          <button
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-lg font-semibold mb-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            type="submit"
          >
            Sign in
          </button>
          <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
            <label htmlFor="checkbox" className="flex items-center">
              <input
                type="checkbox"
                id="checkbox"
                className="mr-2 bg-slate-600 accent-gray-600"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-gray-400">
              Need help?
            </a>
          </div>
          <div className="text-gray-400 text-sm mb-2 flex items-center">
            <p className="mr-1">New to Netflix?</p>
            <a href="#" className="text-white font-semibold">
              Sign up now
            </a>
          </div>
          <div className="text-gray-400 text-sm">
            <p className="inline mr-1">
              This page is protected by Google reCAPTCHA to ensure you`re not a
              bot.
            </p>
            <a href="#" className="text-blue-600 inline">
              Learn more.
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SigninForm;
