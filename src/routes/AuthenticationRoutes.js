import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication/Login')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
     children: [
    {
      path: '/', // route for "/"
      element: <AuthLogin />
    },
    {
      path: 'login', // route for "/login"
      element: <AuthLogin />
    }
  ]

    
};

export default AuthenticationRoutes;



