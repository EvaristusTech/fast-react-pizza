import { useDispatch } from "react-redux";
import Button from "../../ui/Button"
import { deleteItem } from "./cartSlice";

function DeleteItem({pizzaId}) {
    const dispatch = useDispatch();
     function handleDeleteCartItem(){
    dispatch(deleteItem(pizzaId));
  }
    return (
        <Button type="small" onClick={handleDeleteCartItem}>Delete</Button>
    )
}

export default DeleteItem
