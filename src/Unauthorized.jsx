import { Result, Button } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Result
      icon={<FrownOutlined />}
      status="403"
      title="403 - Unauthorized"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <NavLink to="/">
          <Button type="primary">Back Home</Button>
        </NavLink>
      }
    />
  );
};

export default Unauthorized;
