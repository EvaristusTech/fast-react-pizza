import {
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import store from "../../store";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const { 
    username, 
    status: addressStatus, 
    position, 
    address, 
    error: errorAddress 
  } = useSelector((state) => state.user);
  
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoadingAddress = addressStatus === 'loading';

  const formErrors = useActionData();
  const dispatch = useDispatch();
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="py-4 px-6">
      <h2 className="text-xl mb-8 font-semibold">Ready to order? Lets go!</h2>

      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            className="input grow"
            defaultValue={username}
            name="customer"
            required
          />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" className="input w-full" name="phone" required />
            {formErrors?.phone && (
              <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-full">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="relative grow">
            <input
              type="text"
              className="input w-full pr-24"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />
            {!position.latitude && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button 
                  type="small" 
                  disabled={isLoadingAddress}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(fetchAddress());
                  }}
                >
                  {isLoadingAddress ? "Loading..." : "Get Position"}
                </Button>
              </span>
            )}
            {addressStatus === 'error' && (
              <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-full">
                {errorAddress}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.latitude && position.longitude ? `${position.latitude}, ${position.longitude}` : ''} />
          <input 
            type="hidden" 
            name="position" 
            value={position?.latitude && position?.longitude 
              ? `${position.latitude},${position.longitude}` 
              : ''} 
          />
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting ? "Placing Order" : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;