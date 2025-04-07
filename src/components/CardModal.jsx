import {
  Button,
  Input,
  Modal,
  Typography,
  Divider,
  Flex,
  Avatar,
  Space,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  CommentOutlined,
  FileTextOutlined,
  SaveOutlined,
  EditOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useCardStore } from '../store/useCardStore';
import { useCommentStore } from '../store/useCommentStore';
import { cardAPI } from '../api/endpoints/card';
// import { userAPI } from '../api/endpoints/user';

const { Title, Text, Paragraph } = Typography;

const CardModal = ({ isModalOpen, setIsModalOpen }) => {
  const { selectedCard, fetchCards } = useCardStore();
  const {
    comments,
    editingData,
    setEditingData,
    saveComment,
    fetchComments,
    cancelEditing,
    addReply,
    deleteComment,
  } = useCommentStore();

  const [title, setTitle] = useState(selectedCard?.title || '');
  const [description, setDescription] = useState(
    selectedCard?.description || ''
  );
  const [newComment, setNewComment] = useState('');
  const [reply, setReply] = useState('');

  const [activeToggleReplyId, setActiveToggleReplyId] = useState([]);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescription, setEditDescription] = useState(description);

  const [activeReplyId, setActiveReplyId] = useState(null);

  // const [taggedUsers, setTaggedUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem('user-storage'))?.state?.user;

  useEffect(() => {
    if (selectedCard) {
      setTitle(selectedCard.title || '');
      setDescription(selectedCard.description || '');
    }
  }, [selectedCard]);

  useEffect(() => {
    if (selectedCard?.id) {
      fetchComments(selectedCard.id);
    }
  }, [selectedCard?.id]);

  useEffect(() => {
    if (editingData) {
      setNewComment(editingData.description);
    } else {
      setNewComment('');
    }
  }, [editingData]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await userAPI.getAll();
  //       setTaggedUsers(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  useEffect(() => {
    const updateCard = async () => {
      if (isModalOpen === false && selectedCard?.id) {
        let needsUpdate = false;
        let updatedData = {};

        if (selectedCard.title !== title && title.trim() !== '') {
          updatedData.title = title;
          needsUpdate = true;
        } else {
          updatedData.title = selectedCard.title;
        }

        if (needsUpdate) {
          try {
            const response = await cardAPI.update(selectedCard.id, {
              title: updatedData.title,
            });
            console.log('response', response);
            fetchCards(selectedCard.ListMasterId);
          } catch (error) {
            console.log('Error updating Card', error);
          }
        }

        if (needsUpdate) {
          setDescription('');
          setEditDescription('');
          setNewComment('');
        }
      }
    };

    updateCard();
  }, [isModalOpen]);

  useEffect(() => {
    if (isEditingDesc) {
      setEditDescription(description);
    }
  }, [isEditingDesc, description]);

  const handleSaveDescription = async () => {
    try {
      if (!editDescription.trim()) {
        alert("Can't save description without content");
        return;
      }

      await cardAPI.update(selectedCard.id, {
        description: editDescription === '' ? null : editDescription,
      });

      setDescription(editDescription);
      setIsEditingDesc(false);
      fetchCards(selectedCard.ListMasterId);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleDeleteComment = async (comment) => {
    try {
      await deleteComment(comment.id, { CardMasterId: selectedCard.id });
      await fetchComments(selectedCard.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const data = {
      description: newComment,
      UserMasterId: user.id,
      CardMasterId: selectedCard.id,
    };

    if (editingData) {
      await saveComment(editingData.id, data);
    } else {
      await saveComment(null, data);
    }
    fetchComments(selectedCard.id);
    setNewComment('');
  };

  const handleCancelEdit = () => {
    cancelEditing();
    setNewComment('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleReply = async (comment) => {
    setReply(reply);

    const data = {
      description: reply,
      UserMasterId: user?.id,
      ParentId: comment?.id,
    };

    const response = await addReply(data);

    if (response.status === 'success') {
      setReply('');
      fetchComments(selectedCard.id);
      setActiveReplyId(null);
    }
  };

  const handleToggleReplies = (comment) => {
    if (activeToggleReplyId.includes(comment.id)) {
      setActiveToggleReplyId(
        activeToggleReplyId.filter((replyId) => replyId !== comment.id)
      );
    } else {
      setActiveToggleReplyId([...activeToggleReplyId, comment.id]);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);

    if (newComment.trim() === '') {
      if (e.target.value.includes('@')) {
        console.log('single @');
      }
    } else if (e.target.value.endsWith(' @')) {
      console.log('double @');
    }
  };

  return (
    <Modal
      title={
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            border: 'none',
            padding: '0 10px',
            marginBottom: '0',
            width: '95%',
          }}
        />
      }
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        cancelEditing();
      }}
      footer={null}
      width={800}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <Flex align="center" justify="space-between">
            <Title level={5} style={{ margin: 0 }}>
              <FileTextOutlined /> Description
            </Title>
            {description && !isEditingDesc && (
              <Button type="text" onClick={() => setIsEditingDesc(true)}>
                Edit
              </Button>
            )}
          </Flex>

          {isEditingDesc || !description ? (
            <div style={{ marginTop: '0.5rem' }}>
              <Input.TextArea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                placeholder="Add a detailed description..."
                style={{ marginBottom: '0.5rem' }}
              />
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveDescription}
              >
                Save
              </Button>
              {isEditingDesc && (
                <Button
                  style={{ marginLeft: '0.5rem' }}
                  onClick={() => {
                    setEditDescription(description);
                    setIsEditingDesc(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          ) : (
            <Paragraph
              style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                background: '#f9f9f9',
                borderRadius: '4px',
              }}
            >
              {description || 'No description provided.'}
            </Paragraph>
          )}
        </div>

        <Divider />

        <div>
          <Flex align="center" justify="space-between">
            <Title level={5}>
              <CommentOutlined /> Comments {editingData && '(Editing)'}
            </Title>
            {editingData && (
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
                size="small"
              >
                Cancel Editing
              </Button>
            )}
          </Flex>

          {/* <Mentions
            value={newComment}
            onChange={setNewComment}
            placeholder="Comment with @mentions"
            options={taggedUsers.map((user) => {
              return {
                value: String(user.id),
                label: user.email,
              };
            })}
          /> */}

          <div style={{ marginBottom: '1rem' }}>
            <Input.TextArea
              value={newComment}
              onChange={(e) => handleCommentChange(e)}
              rows={2}
              placeholder={
                editingData ? 'Edit your comment...' : 'Write a comment...'
              }
              style={{
                marginBottom: '0.5rem',
                borderColor: editingData ? '#1890ff' : undefined,
                background: editingData ? '#f0f7ff' : undefined,
              }}
            />

            <Button
              type="primary"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              {editingData ? 'Update Comment' : 'Add Comment'}
            </Button>
            {editingData && (
              <Button
                style={{ marginLeft: '0.5rem' }}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
          {comments.length === 0 ? (
            <Text type="secondary">No comments yet.</Text>
          ) : (
            <div
              style={{
                marginTop: '1rem',
                maxHeight: '300px',
                overflow: 'auto',
              }}
            >
              {comments.map((comment, index) => (
                <div key={index}>
                  <div
                    style={{
                      marginBottom: comment.replies?.length ? '0.5rem' : '1rem',
                      padding: '0.75rem',
                      backgroundColor:
                        editingData?.id === comment.id ? '#e6f7ff' : '#f0f0f0',
                      borderRadius: '8px',
                      border:
                        editingData?.id === comment.id
                          ? '1px solid #1890ff'
                          : 'none',
                    }}
                  >
                    <Flex
                      align="center"
                      justify="space-between"
                      style={{ marginBottom: '0.5rem' }}
                    >
                      <Flex align="center">
                        <Avatar
                          icon={<UserOutlined />}
                          size="small"
                          style={{ marginRight: '0.5rem' }}
                        />
                        <Space>
                          <Text strong>
                            {comment.UserMaster?.username || 'Unknown User'}
                          </Text>
                          <Tooltip title={formatDate(comment.createdAt)}>
                            <Text
                              type="secondary"
                              style={{ fontSize: '0.85rem' }}
                            >
                              {comment.createdAt
                                ? new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()
                                : ''}
                            </Text>
                          </Tooltip>
                        </Space>
                      </Flex>
                      <Flex gap={8}>
                        {user.id === comment.UserMasterId && (
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleDeleteComment(comment)}
                            disabled={editingData !== null}
                          />
                        )}
                        {user.id === comment.UserMasterId && (
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => setEditingData(comment)}
                            disabled={editingData !== null}
                          />
                        )}
                        <Button
                          type="text"
                          size="small"
                          onClick={() =>
                            setActiveReplyId(
                              activeReplyId === comment.id ? null : comment.id
                            )
                          }
                        >
                          Reply
                        </Button>
                      </Flex>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>{comment.description}</Text>
                      {comment.replies?.length > 0 && (
                        <Button
                          type="text"
                          icon={<CommentOutlined />}
                          onClick={() => handleToggleReplies(comment)}
                          size="small"
                        />
                      )}
                    </Flex>
                  </div>

                  {comment.replies?.length > 0 && (
                    <div
                      style={{
                        paddingLeft: '2rem',
                        marginBottom: '1rem',
                        display: activeToggleReplyId?.includes(comment?.id)
                          ? 'block'
                          : 'none',
                      }}
                    >
                      {comment.replies.map((reply, replyIndex) => (
                        <div
                          key={`reply-${replyIndex}`}
                          style={{
                            marginBottom: '0.5rem',
                            padding: '0.65rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            fontSize: '0.95rem',
                          }}
                        >
                          <Flex
                            align="center"
                            justify="space-between"
                            style={{ marginBottom: '0.5rem' }}
                          >
                            <Flex align="center">
                              <Avatar
                                icon={<UserOutlined />}
                                size="small"
                                style={{
                                  marginRight: '0.5rem',
                                  width: '20px',
                                  height: '20px',
                                  fontSize: '12px',
                                }}
                              />
                              <Space>
                                <Text strong style={{ fontSize: '0.85rem' }}>
                                  {reply.UserMaster?.username || 'Unknown User'}
                                </Text>
                                <Tooltip title={formatDate(reply.createdAt)}>
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: '0.75rem' }}
                                  >
                                    {reply.createdAt
                                      ? new Date(
                                          reply.createdAt
                                        ).toLocaleDateString()
                                      : ''}
                                  </Text>
                                </Tooltip>
                              </Space>
                            </Flex>
                            {user.id === reply.UserMasterId && (
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => setEditingData(reply)}
                                style={{ fontSize: '0.8rem' }}
                              />
                            )}
                          </Flex>
                          <Text style={{ fontSize: '0.9rem' }}>
                            {reply.description}
                          </Text>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    id={`reply-input-${comment.id}`}
                    style={{
                      paddingLeft: '2rem',
                      marginBottom: '1rem',
                      display: activeReplyId === comment.id ? 'block' : 'none',
                    }}
                  >
                    <div style={{ marginBottom: '0.5rem' }}>
                      <Input.TextArea
                        placeholder="Write a reply..."
                        rows={1}
                        style={{
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem',
                        }}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                      <Flex gap={8}>
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleReply(comment)}
                        >
                          Reply
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setActiveReplyId(null);
                            setReply('');
                          }}
                        >
                          Cancel
                        </Button>
                      </Flex>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CardModal;
