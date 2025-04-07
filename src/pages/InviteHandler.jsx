import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvitationStore } from '../store/useInvitationStore';

const InviteHandler = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  console.log('token', token);

  const { validateInvite, acceptInvite } = useInvitationStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const inviteToken = queryParams.get('token');

    if (inviteToken) {
      setToken(inviteToken);
      validateInvite(token);
    } else {
      setMessage('No invite token provided.');
    }
  }, []);

  const handleAcceptInvite = () => {
    const invite = acceptInvite(token);

    if (invite) {
      alert('Access Granted');
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Invite</h2>
      <p>{message}</p>
      {token && <button onClick={handleAcceptInvite}>Accept Invite</button>}
    </div>
  );
};

export default InviteHandler;
