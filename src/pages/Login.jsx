import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Flex, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { authAPI } from '../api';
import { useUserStore } from '../store/useUserStore';

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { setUser, setToken, setIsAuthenticated } = useUserStore();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values);

      if (response.data) {
        setUser(response.data);
        setToken(response.data.token);
        setIsAuthenticated(true);

        message.success('Login successful!');

        window.location.href = '/';
      }
    } catch (error) {
      console.log('errorrr', error);
      if (error.response) {
        message.error(
          error.response.data?.message ||
            error.response.data?.error ||
            'Login failed. Please check your credentials.'
        );
      } else if (error.request) {
        message.error(
          'No response from server. Please check your network connection.'
        );
      } else {
        message.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card
        style={{
          width: 500,
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>
          Login
        </Title>

        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ marginTop: '1rem' }}
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
            label="Email"
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter Email"
              name="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            label="Password"
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter Password"
              name="password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '1.5rem' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                borderRadius: '8px',
                fontWeight: 'bold',
              }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <NavLink to="/register">Create an account? Register</NavLink>
        </div>
      </Card>
    </Flex>
  );
};

export default Login;
