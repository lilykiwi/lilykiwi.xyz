import type { JSX } from 'preact';

export function Title(props: { text: string; }): JSX.Element {
  return <h1 class="heroTitle"><a href="/">{props.text}</a></h1>;
}
