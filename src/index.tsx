import './style.scss';

import {Home} from 'pages/home';

// global imports
import { render, JSX } from 'preact';
import { useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';

/**
 * Main page component. Renders the sidebar and content.
 * @returns {JSX.Element} The primary page component.
 */
export function Page(): JSX.Element {
  const value = useSignal(0);
  const onScroll = useCallback(() => {
    const element = document.getElementById("main");
    value.value = element?.scrollTop || 0;
  }, []);

  return <Home/>;
}

// TODO: add a toggle for light/dark mode
document.body.setAttribute("data-bs-theme", "dark");
render(<Page />, document.body);
