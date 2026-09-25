import { Link } from "react-router";
import { FiChevronRight, FiHome } from "react-icons/fi";

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium text-slate-600"
      >
        <FiHome className="text-base" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            <FiChevronRight className="mx-2 text-slate-400 text-xs" />
            {isLast || !item.href ? (
              <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-primary transition-colors font-medium text-slate-600"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
