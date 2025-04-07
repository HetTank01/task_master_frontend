import { Form, Input, Modal } from 'antd';
import React from 'react';

const CreateListModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

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
      title="Create List"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Create"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="List Name"
          rules={[
            { required: true, message: 'Please input the name of the list!' },
          ]}
        >
          <Input placeholder="e.g. Marketing Campaign" name="title" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateListModal;
