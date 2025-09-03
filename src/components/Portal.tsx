'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  selector?: string; // Optional selector for the target DOM node
}

export default function Portal({ children, selector }: PortalProps) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = selector ? document.querySelector(selector) : document.body;
    setMounted(true);
  }, [selector]);

  if (!mounted || !ref.current) {
    return null;
  }

  return createPortal(children, ref.current);
}
