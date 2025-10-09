import { JSX } from "preact";

export function Title(props: { text: string; }): JSX.Element {
  return <h1 class="heroTitle">{props.text}</h1>;
}
