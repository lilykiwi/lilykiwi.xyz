import './style.css';

import { render, JSX } from 'preact';
import { Home } from './pages/home';

/**
 * Main page component. Renders the sidebar and content.
 * @returns {JSX.Element} The primary page component.
 */
export function Page(): JSX.Element {
  return <Home />;
}

render(<Page />, document.body);
