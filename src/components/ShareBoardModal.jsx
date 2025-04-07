import { Form, Select, Modal, Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import { useBoardStore } from '../store/useBoardStore';
import { userAPI } from '../api/endpoints/user';
import { transformList } from '../utils/formatResponse';

const ShareBoardModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();

  const { selectedBoard, handleShareBoard } = useBoardStore();

  const [userOptions, setUseroptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getAll();
        setUseroptions(transformList(response.data, 'email', 'email'));
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchUsers();
  }, []);

  const shareBoard = async (values) => {
    const formattedResponse = {
      BoardMasterId: selectedBoard.id,
      ...values,
    };

    handleShareBoard(formattedResponse);
  };

  return (
    <Modal
      title="Share Board"
      open={visible}
      onCancel={onCancel}
      okText="Share"
      onOk={() => {
        form
          .validateFields()
          .then((values) => shareBoard(values))
          .catch((errorInfo) => {
            console.log('Validation failed:', errorInfo);
          });
      }}
    >
      <Form form={form} layout="vertical">
        <Flex gap={10}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please select an email!' }]}
            style={{ flex: '1' }}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select an email"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase()) ||
                (option?.value ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={userOptions}
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
            initialValue="viewer"
            style={{ flex: '1' }}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select a role"
              options={[
                { label: 'Owner', value: 'owner' },
                { label: 'Editor', value: 'editor' },
                { label: 'Viewer', value: 'viewer' },
              ]}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ShareBoardModal;
