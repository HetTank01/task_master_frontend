import React, { useEffect, useState } from 'react';
import { Button, Empty, Typography, Spin, Flex } from 'antd';
import { ShareAltOutlined, PlusOutlined } from '@ant-design/icons';

import { useBoardStore } from '../store/useBoardStore';
import { useListStore } from '../store/useListStore';
import List from '../components/List';
import CreateListModal from '../components/CreateListModal';
import ShareBoardModal from '../components/ShareBoardModal';
import { useCardStore } from '../store/useCardStore';
import { boardAPI } from '../api/endpoints/board';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';

const Dashboard = () => {
  const { selectedBoard, fetchBoardsSharedWithYou } = useBoardStore();

  const {
    loading,
    lists,
    fetchLists,
    editingData,
    createList,
    setEditingData,
    setLists,
  } = useListStore();

  const { moveCard } = useCardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchBoardsSharedWithYou();
  }, []);

  useEffect(() => {
    if (selectedBoard?.id) {
      fetchLists(selectedBoard.id);
    }
  }, [selectedBoard]);

  const handleSubmit = (values) => {
    if (!editingData) {
      const formattedData = {
        BoardMasterId: selectedBoard.id,
        ...values,
      };

      createList(formattedData);
    } else {
      console.log('update logic');
    }

    setIsModalOpen(false);
    setEditingData(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Reduce this for easier drag activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeCard, setActiveCard] = useState(null);
  const [activeList, setActiveList] = useState(null);

  const handleDragStart = (event) => {
    const { active } = event;

    // Handle list dragging
    if (active.data.current?.type === 'list') {
      const draggedList = lists.find((list) => list.id === active.id);
      setActiveList(draggedList);
      return;
    }

    // Handle card dragging
    if (active.data.current?.type === 'card') {
      const listId = active.data.current.listId;
      const cardId = active.id;
      const cardsInList = useCardStore.getState().cards[listId] || [];
      const draggedCard = cardsInList.find(
        (c) => String(c.id) === String(cardId)
      );

      if (draggedCard) {
        setActiveCard({ ...draggedCard, sourceListId: listId });
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveCard(null);
      setActiveList(null);
      return;
    }

    // Handle list reordering
    if (
      active.data.current?.type === 'list' &&
      over.data.current?.type === 'list'
    ) {
      const oldIndex = lists.findIndex((list) => list.id === active.id);
      const newIndex = lists.findIndex((list) => list.id === over.id);

      if (oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);

        // Update positions
        const updatedLists = newLists.map((list, index) => ({
          ...list,
          position: index,
        }));

        // Update local state first
        setLists(updatedLists);

        // Then update on the server
        try {
          await boardAPI.updateListPosition(selectedBoard.id, {
            lists: updatedLists.map(({ id, position }) => ({ id, position })),
          });
        } catch (error) {
          console.error('Error updating list positions:', error);
          // Revert on error
          fetchLists(selectedBoard.id);
        }
      }
    }

    // Handle card movement
    if (active.data.current?.type === 'card') {
      const sourceListId = active.data.current.listId;
      const cardId = active.id;

      // Determine destination list and index
      let destListId;
      let destIndex;

      if (over.data.current?.isCard) {
        // Dropping on another card
        destListId = over.data.current.listId;
        const cardsInDestList = useCardStore.getState().cards[destListId] || [];
        destIndex = cardsInDestList.findIndex(
          (c) => String(c.id) === String(over.id)
        );
      } else if (over.data.current?.type === 'list') {
        // Dropping directly on a list
        destListId = over.id;
        const cardsInDestList = useCardStore.getState().cards[destListId] || [];
        destIndex = cardsInDestList.length;
      } else {
        // Reset active items
        setActiveCard(null);
        setActiveList(null);
        return; // Invalid drop target
      }

      // Only proceed if we have valid source and destination
      if (destListId && destIndex !== undefined) {
        const cardsInSourceList =
          useCardStore.getState().cards[sourceListId] || [];
        const sourceIndex = cardsInSourceList.findIndex(
          (c) => String(c.id) === String(cardId)
        );

        if (sourceIndex === -1) {
          setActiveCard(null);
          setActiveList(null);
          return;
        }

        try {
          await moveCard(
            { listId: sourceListId, index: sourceIndex },
            { listId: destListId, index: destIndex }
          );
        } catch (error) {
          console.error('Error during card drag operation:', error);
          // Refresh all data on error
          if (selectedBoard?.id) fetchLists(selectedBoard.id);
        }
      }
    }

    // Reset active items
    setActiveCard(null);
    setActiveList(null);
  };

  return (
    <>
      {selectedBoard ? (
        <div className="dashboard" style={{ width: '100%', height: '100%' }}>
          <Flex
            className="dashboard-header"
            justify="space-between"
            align="center"
            style={{ padding: '0 0 16px 0' }}
          >
            <h2 style={{ margin: 0 }}>{selectedBoard?.title || 'Board'}</h2>
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              onClick={() => setIsShareModalOpen(true)}
            >
              Share
            </Button>
          </Flex>

          {loading ? (
            <Spin size="large" />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div
                className="lists-container"
                style={{
                  display: 'flex',
                  overflowX: 'auto',
                  padding: '10px 0',
                  gap: '16px',
                  height: 'calc(100vh - 150px)',
                }}
              >
                <SortableContext
                  items={lists.map((list) => list.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {lists.map((list) => (
                    <List list={list} key={list.id} />
                  ))}
                </SortableContext>

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={showModal}
                  style={{
                    minWidth: '200px',
                    marginTop: '0',
                    marginLeft: lists.length > 0 ? '8px' : '0',
                  }}
                >
                  Add List
                </Button>
              </div>

              {/* Drag overlay for visual feedback */}
              <DragOverlay adjustScale={false}>
                {activeCard && (
                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      boxShadow: '0 5px 10px rgba(0,0,0,0.15)',
                      width: '250px',
                      opacity: 0.8,
                    }}
                  >
                    {activeCard.title}
                  </div>
                )}
                {activeList && (
                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      boxShadow: '0 5px 10px rgba(0,0,0,0.15)',
                      width: '280px',
                      opacity: 0.8,
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      {activeList.title}
                    </div>
                    <div
                      style={{
                        height: '100px',
                        backgroundColor: '#f9f9f9',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          )}

          <CreateListModal
            visible={isModalOpen}
            onCreate={handleSubmit}
            onCancel={closeModal}
          />
          <ShareBoardModal
            visible={isShareModalOpen}
            onCancel={() => setIsShareModalOpen(false)}
          />
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <Empty
            description={
              <Typography.Title level={5}>No boards selected</Typography.Title>
            }
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;
