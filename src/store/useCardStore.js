import { create } from 'zustand';
import { cardAPI } from '../api/endpoints/card';
import { listAPI } from '../api/endpoints/list';

export const useCardStore = create((set, get) => ({
  cards: {},

  loading: false,
  setLoading: (loading) => set({ loading }),

  selectedCard: {},
  setSelectedCard: (selectedCard) => set({ selectedCard }),

  setCards: (listId, newCards) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [listId]: newCards,
      },
    }));
  },

  fetchCards: async (listId) => {
    try {
      const response = await cardAPI.getAll({ listId });
      set((state) => ({
        cards: {
          ...state.cards,
          [listId]: response.data.sort((a, b) => a.position - b.position),
        },
      }));

      console.log('Fetched cards for', listId, response.data);
    } catch (error) {
      console.log('Error fetching cards:', error);
    }
  },

  createCard: async (data) => {
    set({ loading: true });
    try {
      const response = await cardAPI.create(data);
      return response.data;
    } catch (error) {
      console.log('Error creating card:', error);
    } finally {
      set({ loading: false });
    }
  },

  moveCard: async (source, destination) => {
    const { listId: sourceListId, index: sourceIndex } = source;
    const { listId: destListId, index: destIndex } = destination;
    const { cards } = get();

    // Ensure IDs are strings for consistent comparison
    const sourceListIdStr = String(sourceListId);
    const destListIdStr = String(destListId);

    // Get the current cards in source list
    const sourceCards = [...(cards[sourceListIdStr] || [])];
    if (sourceCards.length === 0) return; // No cards to move

    // Get the card being moved
    const [movedCard] = sourceCards.splice(sourceIndex, 1);
    if (!movedCard) return;

    // Prepare the destination cards array
    let destCards;
    if (sourceListIdStr === destListIdStr) {
      // Same list, just use the source array after removing the card
      destCards = sourceCards;
    } else {
      // Different list, get the destination list's cards
      destCards = [...(cards[destListIdStr] || [])];
    }

    // Insert the moved card at the destination index
    const updatedMovedCard = {
      ...movedCard,
      ListMasterId: parseInt(destListIdStr),
      position: destIndex,
    };
    destCards.splice(destIndex, 0, updatedMovedCard);

    // Update positions for all affected cards
    const updatedSourceCards = sourceCards.map((card, index) => ({
      ...card,
      position: index,
    }));

    const updatedDestCards = destCards.map((card, index) => ({
      ...card,
      position: index,
    }));

    // Update local state first for immediate feedback
    set((state) => ({
      cards: {
        ...state.cards,
        [sourceListIdStr]: updatedSourceCards,
        [destListIdStr]: updatedDestCards,
      },
    }));

    try {
      if (sourceListIdStr === destListIdStr) {
        // Same list - just update positions
        await listAPI.updateCardPosition(sourceListIdStr, {
          cards: updatedDestCards.map(({ id, position }) => ({
            id,
            position,
          })),
        });
      } else {
        // Different lists - need to move the card and update positions
        // 1. Move the card to the new list
        await cardAPI.moveCard(movedCard.id, {
          targetListId: parseInt(destListIdStr),
          position: destIndex,
        });

        // 2. Update positions in both source and destination lists
        await Promise.all([
          listAPI.updateCardPosition(sourceListIdStr, {
            cards: updatedSourceCards.map(({ id, position }) => ({
              id,
              position,
            })),
          }),
          listAPI.updateCardPosition(destListIdStr, {
            cards: updatedDestCards.map(({ id, position }) => ({
              id,
              position,
            })),
          }),
        ]);

        console.log('Error from else block');
      }
    } catch (error) {
      console.error('Error updating card positions:', error);

      // Revert state on error
      set((state) => ({
        cards: {
          ...state.cards,
          [sourceListIdStr]: cards[sourceListIdStr] || [],
          [destListIdStr]: cards[destListIdStr] || [],
        },
      }));
    }
  },
}));
