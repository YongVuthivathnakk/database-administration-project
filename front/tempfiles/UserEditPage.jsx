import { useNavigate, useParams } from "react-router-dom";
import UserForm from "./UserForm";
import { updateUser, getUserById } from "../src/services/api";
import { useEffect, useState } from "react";

export default function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    getUserById(id).then(setInitialData);
  }, [id]);

  const handleSubmit = async (userData) => {
    await updateUser(id, userData);
    navigate("/users");
  };

  if (!initialData) return <div>Loading...</div>;

  return <UserForm initialData={initialData} onSubmit={handleSubmit} onCancel={() => navigate("/users")} />;
} 