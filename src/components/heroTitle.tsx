import type { JSX } from 'preact';
import { TitleImage } from './titleImage';

export function Title(props: { text: string; }): JSX.Element {
  return <h1 class="heroTitle"><a href="/"><TitleImage text={props.text} size="hero" /></a></h1>;
}
