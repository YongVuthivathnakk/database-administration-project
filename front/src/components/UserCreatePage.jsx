import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { createUser } from "../services/api";

export default function UserCreatePage() {
  // const navigate = useNavigate();

  // const handleSubmit = async (userData) => {
  //   await createUser(userData);
  //   navigate("/users");
  // };

  return <UserForm />;
} 