import { Result } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const UnderConstruction = () => {
  return (
    <Result
      status={'500'}
      icon={<ToolOutlined style={{ fontSize: 48, color: '#faad14' }} />}
      title="Page Under Construction"
      subTitle="We're working hard to bring this page to you soon. Stay tuned!"
    />
  );
};

export default UnderConstruction;
