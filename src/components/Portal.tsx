'use client';

import { ReactNode, useSyncExternalStore, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  selector?: string;
}

export default function Portal({ children, selector }: PortalProps) {
  const subscribe = useCallback(() => () => {}, []);

  const getSnapshot = useCallback(() => {
    return selector ? document.querySelector(selector) : document.body;
  }, [selector]);

  const getServerSnapshot = useCallback(() => null, []);

  const container = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
}
