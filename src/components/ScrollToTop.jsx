// src/components/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент, який прокручує вікно догори при зміні маршруту.
 */
const ScrollToTop = () => {
  // Отримуємо поточний шлях
  const { pathname } = useLocation();

  useEffect(() => {
    // Прокрутка вікна до самого верху
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Можна змінити на 'auto', якщо не потрібна анімація
    });
  }, [pathname]); // Ефект спрацьовує щоразу, коли змінюється pathname

  // Компонент не рендерить нічого
  return null;
};

export default ScrollToTop;