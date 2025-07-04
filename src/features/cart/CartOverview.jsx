import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
 const totalCartQuantity = useSelector(getTotalCartQuantity);
 const totalCartPrice = useSelector(getTotalCartPrice);
 console.log(totalCartQuantity)


 if(!totalCartQuantity) return null;

  return (
    <div className="bg-stone-800 text-stone-200 uppercase px-4 py-4 text-sm sm:px-6 md:text-base flex items-center justify-between">
      <p className="font-semibold text-stone-300 space-x-4 sm:space-x-6">
        <span>{totalCartQuantity} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
