import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import useAPI from 'hooks/useAPI';

import DefaultPicture from 'images/img-user-profile.svg';

import { CurrentUserContext } from 'context/CurrentUserContext';

function useCurrentUser() {
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [API] = useAPI();
  const navigate = useNavigate();
  const accessToken = API.token.get();
  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await API.user.me();
      setCurrentUser({
        ...data,
        picture: data.picture || DefaultPicture,
      });
    } catch (error) {
      setCurrentUser(null);
      API.token.delete();
    }
    // eslint-disable-next-line
  }, [accessToken, setCurrentUser]);

  const deleteSession = useCallback(async () => {
    try {
      navigate('/');
      await API.session.delete();
    } finally {
      API.token.delete();
      window.location.reload();
    }
  }, [navigate, API]);

  return {
    currentUser,
    accessToken,
    getCurrentUser,
    deleteSession,
  };
}

export default useCurrentUser;
