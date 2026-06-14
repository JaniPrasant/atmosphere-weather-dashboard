import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              Atmosphere<span className="text-blue-600">.io</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Console
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-50 px-3 py-1.5 font-medium text-red-600 hover:bg-red-100 active:scale-98 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-3.5 py-2 font-medium text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
