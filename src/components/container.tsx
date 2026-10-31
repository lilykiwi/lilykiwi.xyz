import { JSX } from "preact";

export function Container({ children }: { children?: any }): JSX.Element {
  return <div class="container">
    {children}
  </div>;
}
