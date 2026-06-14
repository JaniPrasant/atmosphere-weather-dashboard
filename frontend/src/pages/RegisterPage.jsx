import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const newUser = { email, password };

    try {
      await axios.post("/api/auth/register", newUser);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Generate Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Register new unique system credentials
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-600 border border-emerald-100">
              {success}
            </div>
          )}

          <div className="space-y-1">
            <label
              className="text-xs font-bold uppercase tracking-wider text-slate-400"
              htmlFor="email"
            >
              Email Target
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={onChange}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-xs font-bold uppercase tracking-wider text-slate-400"
              htmlFor="password"
            >
              Security Protocol Cipher
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={onChange}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 shadow-xs focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:scale-98 transition-all"
          >
            Commit Matrix Credentials
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already verified?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Return to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
