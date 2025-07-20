import { useNavigate } from "react-router-dom";
import BeekeeperForm from "./BeekeeperForm";
import { createBeekeeper } from "../services/api";

export default function BeekeeperCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (beekeeperData) => {
    await createBeekeeper(beekeeperData);
    navigate("/beekeepers");
  };

  return <BeekeeperForm onSubmit={handleSubmit} onCancel={() => navigate("/beekeepers")} />;
} 