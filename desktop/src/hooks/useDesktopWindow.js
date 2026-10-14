import {useEffect, useRef, useState} from 'react';

export function useDesktopWindow() {
  const [expanded, setExpanded] = useState(false);
  const [windowVisible, setWindowVisible] = useState(true);
  const visibleRef = useRef(true);

  useEffect(() => {
    const update = value => {
      visibleRef.current = value;
      setWindowVisible(value);
    };
    const unsubscribe = window.desktop?.onVisibility(update);
    window.desktop?.isVisible().then(update);
    return () => unsubscribe?.();
  }, []);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    window.desktop?.resize(next);
  };

  const close = () => window.desktop?.close();

  return {expanded, windowVisible, visibleRef, toggleExpanded, close};
}
