import { Form, Modal, Input } from 'antd';
import React, { useEffect } from 'react';
import { useBoardStore } from '../store/useBoardStore';

const CreateBoardModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const { editingData } = useBoardStore();

  useEffect(() => {
    if (editingData) {
      form.setFieldsValue({
        title: editingData.title,
      });
    }
  }, [editingData, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Create Board"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editingData ? 'Update' : 'Create'}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Board Name"
          rules={[
            { required: true, message: 'Please input the name of the board!' },
          ]}
        >
          <Input placeholder="e.g. Marketing Campaign" name="title" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBoardModal;
