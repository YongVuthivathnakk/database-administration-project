import { useNavigate, useParams } from "react-router-dom";
import BeekeeperForm from "./BeekeeperForm";
import { updateBeekeeper, getBeekeeperById } from "../services/api";
import { useEffect, useState } from "react";

export default function BeekeeperEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    getBeekeeperById(id).then(setInitialData);
  }, [id]);

  const handleSubmit = async (beekeeperData) => {
    await updateBeekeeper(id, beekeeperData);
    navigate("/beekeepers");
  };

  if (!initialData) return <div>Loading...</div>;

  return <BeekeeperForm initialData={initialData} onSubmit={handleSubmit} />;
} 