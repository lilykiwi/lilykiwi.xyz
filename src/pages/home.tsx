import { Hero } from '../components/hero';
import { Navbar } from '../components/navbar';
import { Repositories } from '../components/repos';
import { Container } from '../components/container';

import { JSX } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';

/**
 * @todo: document this
 */
export function Home(): JSX.Element {
  const stuck = useSignal(false);
  const titleGone = useSignal(false);
  const header = useRef<HTMLDivElement>(null);

  // The hero and nav strip live in one sticky block that is pulled up by the hero's height,
  // so only the strip stays pinned. That keeps them a single painted surface (no seam).
  useLayoutEffect(() => {
    const el = header.current;
    const hero = el?.querySelector<HTMLElement>('.hero');
    const title = el?.querySelector<HTMLElement>('.heroTitle');
    if (!el || !hero || !title) return;

    const measure = () => el.style.setProperty('--hero-h', `${hero.offsetHeight}px`);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(hero);

    // stuck once the hero has scrolled fully out of view; the strip's brand takes over as soon as the big title is gone
    const onScroll = () => {
      stuck.value = window.scrollY >= hero.offsetHeight;
      titleGone.value = title.getBoundingClientRect().bottom <= 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return <>
    <div ref={header} class={`siteHeader${stuck.value ? ' stuck' : ''}${titleGone.value ? ' titleGone' : ''}`}>
      <Hero />
      <Navbar />
    </div>
    <Container>
      <Repositories />
    </Container>
  </>;
}
