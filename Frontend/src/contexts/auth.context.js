import React, {createContext, useState, useContext, useReducer} from 'react';

const AuthContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        authToken: action.authToken,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        authToken: action.authToken,
        loggedIn: true,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        authToken: null,
      };
  }
}

function AuthProvider(props) {
  const [userInfo, setUserInfo] = useState({});
  const initialState = {
    isLoading: true,
    isSignout: false,
    authToken: null,
    loggedIn: false,
  };

  const [authState, dispatch] = useReducer(reducer, initialState);

  const signIn = async authToken => {
    // We will also need to handle errors if sign in failed
    dispatch({type: 'SIGN_IN', authToken: authToken});
  };

  const signOut = () => dispatch({type: 'SIGN_OUT'});

  return (
    <AuthContext.Provider
      value={{
        userInfo: userInfo,
        authState: authState,
        setUserInfo: setUserInfo,
        signIn: signIn,
        signOut: signOut,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  return useContext(AuthContext);
}

export {AuthProvider, useAuthContext};
