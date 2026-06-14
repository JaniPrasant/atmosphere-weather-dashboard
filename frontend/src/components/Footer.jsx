import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-base font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Atmosphere<span className="text-blue-600">.io</span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Console
            </Link>
            <a
              href="https://github.com/JaniPrasant/atmosphere-weather-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Documentation
            </a>
            <a
              href="mailto:jani.prasant2810@gmail.com"
              className="hover:text-blue-600 transition-colors"
            >
              Support
            </a>
          </div>
          <div className="text-center text-xs text-slate-400 dark:text-slate-500 sm:text-right">
            &copy; {currentYear} Atmosphere.io. Engineered by{" "}
            <a
              href="https://github.com/JaniPrasant"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 transition-colors"
            >
              Prashant Jani
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
