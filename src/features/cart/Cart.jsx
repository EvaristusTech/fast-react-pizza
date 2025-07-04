import { Link } from "react-router-dom";
import LinkButton from "../../ui/LinkButton";
import Button from "../../ui/Button";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "./EmptyCart";
import { clearCart, deleteItem, getCart } from "./cartSlice";
import { getUsername } from "../user/userSlice";


function Cart() {
  const dispatch = useDispatch();
  const username = useSelector(getUsername);
  const cart = useSelector(getCart);

  function handleClearCart(){
    dispatch(clearCart());
  }

  if(!cart.length) return <EmptyCart />

  return (
    <div className="py-4 px-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

      <ul className="divide-y divide-stone-200 border-b mt-3">
        {cart.map((item) => (
          <CartItem item={item} key={item.pizzaId} />
        ))}
      </ul>

      <div className="mt-6 space-x-2">
        <Button to="/order/new" type="primary">
          Order pizzas
        </Button>

        <Button type="secondary" onClick={handleClearCart}>Clear cart</Button>
      </div>
    </div>
  );
}

export default Cart;
