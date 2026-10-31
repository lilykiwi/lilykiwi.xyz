import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { Repositories } from '../components/repos';
import { Container } from '../components/container';

import { JSX } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';

/**
 * @todo: document this
 */
export function Home(): JSX.Element {
  const stuck = useSignal(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // the navbar is stuck once the sentinel (directly above it) leaves the top of the viewport
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      stuck.value = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <>
    <Hero />
    <div ref={sentinel} class="sentinel" />
    <Navbar stuck={stuck.value} />
    <Container>
      <Repositories />
    </Container>
  </>;
}
