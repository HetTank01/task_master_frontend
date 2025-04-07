import { Result, Button } from 'antd';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404 - Page Not Found"
      subTitle="Oops! The page you're looking for doesn't exist."
      extra={
        <NavLink to="/">
          <Button type="primary">Back Home</Button>
        </NavLink>
      }
    />
  );
};

export default NotFound;
