// Events.tsx

import React, { useState } from 'react';
import { Models } from 'appwrite';
import { Loader } from '@/components/shared';
import  { Button } from '@/components/ui/button'
import EventCard from '@/components/shared/EventCard';
// import  UserCard  from '@/components/shared/UserCard'; , useGetUsers
import EventCreationForm from '@/components/forms/EventCreationForm'; 
import { useGetEvents } from '@/lib/react-query/queries';

const Events: React.FC = () => {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const {
    data: events,
    isLoading: isEventLoading,
    isError: isErrorEvents,
  } = useGetEvents();

  const handleCreateEventClick = () => {
    setIsCreatingEvent(true);
  };

  const handleCancelEventCreation = () => {
    setIsCreatingEvent(false);
  };

  if (isErrorEvents) {
    return (
      <div className="flex flex-1">
        <div className="events-container">
          <p className="body-medium text-light-1">Algo deu errado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="events-container">
        {isCreatingEvent ? (
          // Se estiver criando um evento, renderize o formulário de criação de eventos
          <EventCreationForm onCancel={handleCancelEventCreation} />
        ) : (
          // Caso contrário, renderize a lista de eventos
          <div className="events-list">
              <h2 className="h3-bold md:h2-bold text-left">Eventos</h2>
            <div className="shad-button_primary whitespace-nowrap">
              <Button onClick={handleCreateEventClick}>Criar Evento</Button>
            </div>
            {isEventLoading && !events ? (
              <Loader />
            ) : (
              <ul className="flex flex-col flex-1 gap-9 w-full">
                {events?.documents.map((event: Models.Document) => (
                  <li key={event.$id} className="w-full">
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;