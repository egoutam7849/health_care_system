import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token') || localStorage.getItem('healthflow_token');
    const savedUser = localStorage.getItem('user') || localStorage.getItem('healthflow_user');
    const savedRole = localStorage.getItem('role');
    const savedRefresh = localStorage.getItem('refresh_token');

    if (savedToken && savedUser) {
      try {
        const parsedUser = typeof savedUser === 'string' ? JSON.parse(savedUser) : savedUser;
        setUser(parsedUser);
        setToken(savedToken);
        setRole(savedRole || parsedUser.role || 'Admin');
        setRefreshToken(savedRefresh);
      } catch (e) {
        setUser(null);
        setToken(null);
        setRole(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (authData, argToken, argRole, argRefresh) => {
    let uObj, tok, rVal, refTok;

    if (typeof authData === 'object' && authData !== null && (authData.access_token || authData.user)) {
      tok = authData.access_token || argToken || 'mock_access_token';
      refTok = authData.refresh_token || argRefresh || 'mock_refresh_token';
      rVal = authData.role || (authData.user && authData.user.role) || 'Admin';
      uObj = authData.user || authData;
    } else {
      uObj = authData;
      tok = argToken;
      rVal = argRole || (uObj && uObj.role) || 'Admin';
      refTok = argRefresh || 'mock_refresh_token';
    }

    setUser(uObj);
    setToken(tok);
    setRole(rVal);
    setRefreshToken(refTok);

    localStorage.setItem('access_token', tok);
    localStorage.setItem('healthflow_token', tok);
    localStorage.setItem('refresh_token', refTok);
    localStorage.setItem('role', rVal);
    localStorage.setItem('user', JSON.stringify(uObj));
    localStorage.setItem('healthflow_user', JSON.stringify(uObj));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setRefreshToken(null);

    localStorage.removeItem('access_token');
    localStorage.removeItem('healthflow_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('healthflow_user');
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, token, role, refreshToken, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
