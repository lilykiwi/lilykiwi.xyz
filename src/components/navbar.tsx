import { JSX } from 'preact';
import { Container } from './container';
import { Title } from './heroTitle';

export function Navbar(links): JSX.Element {
  return <nav class="navbar bg-body-tertiary border-bottom border-dark-subtle">
    <Container>
      <a class="navbar-brand" href="#">
        <Title text="lilykiwi.xyz" />
      </a>
    </Container>
  </nav>;
}

export function NavLink(props: { text: string; }): JSX.Element {
  return <p><a href="#">{props.text}</a></p>;
}
