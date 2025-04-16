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

  const onFinish = (values) => {
    form.resetFields();
    onCreate(values);
  };

  return (
    <Modal
      title="Create Board"
      open={visible}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText={editingData ? 'Update' : 'Create'}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Board Name"
          rules={[
            { required: true, message: 'Please input the name of the board!' },
          ]}
        >
          <Input placeholder="e.g. Marketing Campaign" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBoardModal;
