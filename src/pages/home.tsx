import { Navbar } from 'components/navbar';
import { Title } from 'components/heroTitle';
import { Repositories } from 'components/repos';
import { Container } from 'components/container';

// global imports
import { render, JSX } from 'preact';
import { useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import Alert  from 'bootstrap/js/dist/alert';
import Button from 'bootstrap/js/dist/button';
import Carousel from 'bootstrap/js/dist/carousel';
import Collapse from 'bootstrap/js/dist/collapse';
import Dropdown from 'bootstrap/js/dist/dropdown';
import Modal from 'bootstrap/js/dist/modal';
import Offcanvas from 'bootstrap/js/dist/offcanvas';
import Popover from 'bootstrap/js/dist/popover';
import ScrollSpy from 'bootstrap/js/dist/scrollspy';
import Tab from 'bootstrap/js/dist/tab';
import Toast from 'bootstrap/js/dist/toast';
import Tooltip from 'bootstrap/js/dist/tooltip';

/**
 * @todo: document this
 */
export function Home(): JSX.Element {
  return <>
    <Navbar />
    <Container>
      <Repositories />
    </Container>
  </>;
}
