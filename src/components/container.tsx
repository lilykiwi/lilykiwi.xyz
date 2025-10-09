import { JSX } from "preact";

export function Container({children}): JSX.Element {
  return <div class="container">
    {children}
  </div>;
}
