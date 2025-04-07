import React, { useState, useEffect } from 'react';
import {
  PlusOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Layout, Button, Typography, Divider } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useBoardStore } from '../store/useBoardStore';
import CreateBoardModal from '../components/CreateBoardModal';

const { Sider, Content, Header } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user, setUser } = useUserStore();
  const {
    boards,
    handleCreateBoard,
    fetchBoards,
    setEditingData,
    editingData,
    handleUpdateBoard,
    handleDeleteBoard,
    setSelectedBoard,
    sharedWithYou,
  } = useBoardStore();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem('user-storage');
      try {
        const parsedUser = storedUser ? JSON.parse(storedUser)?.state : null;
        setUser(parsedUser?.user || null);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    };

    updateUser();
  }, [setUser]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const handleEditBoard = (board) => {
    setEditingData(board);
    showModal();
  };

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => setIsModalOpen(false);

  const handleSubmit = async (values) => {
    if (!editingData) {
      handleCreateBoard(values);
    } else {
      handleUpdateBoard(editingData.id, values);
    }

    setIsModalOpen(false);
    setEditingData(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={260}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#1d2125',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'white' }}
          />
          {!collapsed && (
            <Typography.Title level={5} style={{ color: 'white' }}>
              Logo
            </Typography.Title>
          )}
        </div>
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          {!collapsed && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                gap: '10px',
              }}
            >
              <DashboardOutlined />
              <Typography.Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                Your Boards
              </Typography.Text>
            </div>
          )}

          <Button
            type="text"
            icon={<PlusOutlined />}
            style={{ color: 'white' }}
            onClick={showModal}
          />
        </div>
        <div
          style={{
            padding: '16px',
            color: 'white',
            display: collapsed ? 'none' : 'block',
          }}
        >
          {boards.length === 0 ? (
            <Typography.Text style={{ color: 'rgba(255,255,255,0.5)' }}>
              No boards yet
            </Typography.Text>
          ) : (
            boards.map((board) => (
              <div
                key={board.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                }}
              >
                <Typography.Text
                  style={{ color: 'white', flex: 1 }}
                  onClick={() => setSelectedBoard(board)}
                >
                  {board.title}
                </Typography.Text>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <EditOutlined
                    style={{ color: '#ffffffb3', cursor: 'pointer' }}
                    onClick={() => handleEditBoard(board)}
                  />
                  <DeleteOutlined
                    style={{ color: '#ff4d4f', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id);
                    }}
                  />
                </div>
              </div>
            ))
          )}
          <Divider
            style={{ borderColor: 'gray', color: 'white', fontSize: '12px' }}
          >
            Shared Boards
          </Divider>
          {sharedWithYou.length === 0 ? (
            <Typography.Text style={{ color: 'rgba(255,255,255,0.5)' }}>
              No shared boards yet
            </Typography.Text>
          ) : (
            sharedWithYou.map((board) => (
              <div
                key={board.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                }}
              >
                <Typography.Text
                  style={{ color: 'white', flex: 1 }}
                  onClick={() => setSelectedBoard(board)}
                >
                  {board.title}
                </Typography.Text>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <EditOutlined
                    style={{ color: '#ffffffb3', cursor: 'pointer' }}
                    onClick={() => handleEditBoard(board)}
                  />
                  <DeleteOutlined
                    style={{ color: '#ff4d4f', cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Sider>

      <CreateBoardModal
        visible={isModalOpen}
        onCreate={handleSubmit}
        onCancel={handleCancel}
      />

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'all 0.2s',
          background: '#f5f5f5',
        }}
      >
        <Header
          style={{
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Typography.Text>{user?.email || 'Guest'}</Typography.Text>
            <Button type="default" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: '24px',
            background: '#ffffff',
            borderRadius: '8px',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
