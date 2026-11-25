import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { App as NativeApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const NativeNavigationBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    let listener;
    let active = true;
    NativeApp.addListener('backButton', () => {
      const path = window.location.pathname;
      const home = path.startsWith('/worker/') ? '/worker/home' : path.startsWith('/customer/') ? '/customer/home' : '/';
      const index = window.history.state?.idx;
      if (Number.isInteger(index) && index > 0) navigate(-1);
      else if (path !== home) navigate(home, { replace: true });
      else void NativeApp.exitApp();
    }).then((handle) => {
      if (active) listener = handle;
      else void handle.remove();
    });
    return () => {
      active = false;
      void listener?.remove();
    };
  }, [navigate]);

  return <Outlet />;
};

export default NativeNavigationBridge;
