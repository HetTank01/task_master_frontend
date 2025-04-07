import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableCard = ({ card, listId, cardOnClick }) => {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: String(card.id),
    data: { type: 'card', listId: String(listId), isCard: true },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 0,
    cursor: 'grab',
    padding: '10px',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    marginBottom: '5px',
    userSelect: 'none',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    cardOnClick(card);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="list-card"
      onClick={handleClick}
    >
      {card.title}
    </div>
  );
};

export default SortableCard;
