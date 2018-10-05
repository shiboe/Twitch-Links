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
        <div className="issues">
          <a target="_blank" href="https://github.com/shiboe/Twitch-Links/issues">
            <i className="fas fa-question-circle"></i>
            <span>Questions, suggestions, bugs</span>
          </a>
        </div>

        <a className="test" onClick={ () => this.test() }><i className="fas fa-vial"></i></a>
      </footer>
    );
  }

  test() {
    const links = [
      `https://www.youtube.com/watch?v=6n3pFFPSlW4`,
      `https://en.wikipedia.org/wiki/Meme`,
      `https://github.com/shiboe/Twitch-Links`
    ];

    messenger.addLinks(links);
  }
}
