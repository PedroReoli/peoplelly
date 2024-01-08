import React from 'react';
import { Models } from 'appwrite';

interface EventCardProps {
  event: Models.Document;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { title, description, date, location, participants } = event.data;

  return (
    <div className="event-card">
      <h3 className="event-title">{title}</h3>
      <p className="event-date">{new Date(date).toLocaleDateString()}</p>
      <p className="event-location">{location}</p>
      <p className="event-description">{description}</p>
      <div className="event-participants">
        <h4>Participantes:</h4>
        <ul>
          {participants.map((participant: any) => (
            <li key={participant}>{participant}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventCard;
