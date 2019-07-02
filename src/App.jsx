import React, { Suspense, useState, useEffect } from 'react';
import { Router } from '@reach/router';

import useCurrentUser from 'hooks/useCurrentUser';

import GlobalHeader from 'components/organisms/GlobalHeader';
import GlobalFooter from 'components/organisms/GlobalFooter';
import Spinner from 'components/atoms/Spinner';

const HomePage = React.lazy(() => import('pages/HomePage'));
const LoginPage = React.lazy(() => import('pages/LoginPage'));
const SignupPage = React.lazy(() => import('pages/SignupPage'));
const MyPage = React.lazy(() => import('pages/MyPage'));
const Dashboard = React.lazy(() => import('pages/Dashboard'));

const NotFound = () => (
  <div style={{
    margin: 'auto',
    fontSize: '54px',
    fontWeight: 'bold',
  }}
  >
    404
  </div>
);

function App() {
  const { getCurrentUser } = useCurrentUser();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    async function loading() {
      try {
        await getCurrentUser();
      } finally {
        setIsLoaded(true);
      }
    }

    loading();
  }, [getCurrentUser]);

  return (
    <div className="root">
      {isLoaded && (
        <>
          <GlobalHeader />
          <Router>
            <Suspense path="/" fallback={<Spinner />}>
              <HomePage path="/" />
              <LoginPage path="login" />
              <SignupPage path="signup/*" />

              <MyPage path="my/*" />
              <Dashboard path="dashboard/*" />

              <NotFound default />
            </Suspense>
          </Router>
          <GlobalFooter />
        </>
      )}
    </div>
  );
}

export default App;
