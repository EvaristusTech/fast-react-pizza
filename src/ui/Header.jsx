import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";
import Username from "../features/user/Username";

function Header() {
  return (
    <div className="flex items-center justify-between bg-yellow-400 px-4 py-3 uppercase border-b border-stone-200 sm:px-6 font-serif">
      <Link to="/" className="tracking-widest">
        Fast React Pizza Co.
      </Link>
      <SearchOrder />
      <Username />
    </div>
  );
}

export default Header;
