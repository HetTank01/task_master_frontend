import React, { useEffect, useState } from 'react';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useCardStore } from '../store/useCardStore';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableCard from './SortableCard';
import CardModal from './CardModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import socket from '../socket';

const List = ({ list }) => {
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { createCard, fetchCards, cards, setSelectedCard, selectedCard } =
    useCardStore();

  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: list.id,
    data: { type: 'list' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  useEffect(() => {
    if (list?.id) {
      fetchCards(list.id);

      const handleCardAdded = (data) => {
        if (data.ListMasterId === list.id) {
          fetchCards(list.id);
        }
      };

      socket.on('card:added', handleCardAdded);

      return () => socket.off('card:added', handleCardAdded);
    }
  }, [list?.id, fetchCards]);

  const listCards = (cards[list.id] || []).sort(
    (a, b) => a.position - b.position
  );

  const handleCreateCard = () => setIsBtnClicked(true);

  const handleOnClick = (data) => {
    setSelectedCard(data);
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    try {
      const cardData = { title: values.title, ListMasterId: list.id };
      await createCard(cardData);
      await fetchCards(list.id);

      socket.emit('card:add', { ListMasterId: list.id });

      setIsBtnClicked(false);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="list" {...attributes}>
      <div className="list-header" {...listeners}>
        <span>{list.title}</span>
      </div>

      <div className="list-content">
        <SortableContext
          items={listCards.map((card) => String(card.id))}
          strategy={verticalListSortingStrategy}
        >
          {listCards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              listId={list.id}
              cardOnClick={handleOnClick}
            />
          ))}
        </SortableContext>
      </div>

      {isBtnClicked ? (
        <Form onFinish={onFinish} className="card-form">
          <Form.Item
            name="title"
            rules={[{ required: true, message: 'Enter a card title' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <div className="form-actions">
            <Button type="primary" htmlType="submit">
              Add Card
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={() => setIsBtnClicked(false)}
            />
          </div>
        </Form>
      ) : (
        <button className="add-card-btn" onClick={handleCreateCard}>
          <PlusOutlined /> Add a card
        </button>
      )}

      {selectedCard && (
        <CardModal
          selectedCard={selectedCard}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default List;
