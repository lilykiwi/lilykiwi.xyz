import { JSX } from 'preact';

/**
 * A titled page section. The id is what the sidebar links and scrollspy target.
 */
export function Section({ id, title, children }: { id: string; title: string; children?: any }): JSX.Element {
  return <section id={id} class="section">
    <h2 class="sectionHeading">{title}</h2>
    {children}
  </section>;
}
