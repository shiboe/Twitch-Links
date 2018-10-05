import * as React from "react";

import { Link } from '../../classes/link.class';
import { messenger } from '../classes/messenger.class';

export class FooterComponent extends React.Component <{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="footer-container">
        <a className="test" onClick={ () => this.test() }>test</a>
      </footer>
    );
  }

  test() {
    const links = [
      `https://www.youtube.com/watch?v=6n3pFFPSlW4`,
      `https://en.wikipedia.org/wiki/Meme`,
      `https://github.com/shiboe/Twitchlinks`
    ];

    messenger.addLinks(links);
  }
}
