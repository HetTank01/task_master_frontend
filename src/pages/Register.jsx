import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { authAPI } from '../api';

const { Title } = Typography;

const Register = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await authAPI.register(values);
      console.log('respose', response);
      if (response.data) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Registration failed:', error);
      message.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div
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
          Register
        </Title>

        <Form
          name="register"
          initialValues={{ remember: true }}
          style={{ marginTop: '1rem' }}
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            rules={[{ required: true, message: 'Please input your username!' }]}
            label="Username"
            name="username"
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter UserName"
              name="username"
            />
          </Form.Item>

          <Form.Item
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
            label="Email"
            name="email"
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter Email"
              name="email"
            />
          </Form.Item>

          <Form.Item
            rules={[{ required: true, message: 'Please input your password!' }]}
            label="Password"
            name="password"
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
              style={{
                borderRadius: '8px',
                fontWeight: 'bold',
              }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <NavLink to="/login">Already have an account? Log in</NavLink>
        </div>
      </Card>
    </div>
  );
};

export default Register;
