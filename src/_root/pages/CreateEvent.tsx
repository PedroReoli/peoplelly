// CreateEvent.tsx
import React from "react";
import EventCreationForm from "@/components/forms/EventCreationForm"; // Correção na importação

const CreateEvent: React.FC = () => {
  const handleCancel = () => {
    // Lógica para lidar com o cancelamento do formulário, se necessário
    console.log("Event creation canceled");
  };

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-3xl font-semibold mb-4">Criar Evento</h2>

      {/* Renderize o componente de formulário e passe a função de cancelamento como prop */}
      <EventCreationForm onCancel={handleCancel} />
    </div>
  );
};

export default CreateEvent;
