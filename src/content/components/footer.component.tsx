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
    const rand = Math.floor(Math.random()*1000);
    const links = [`https://www.testlink.com/${rand}`];
    messenger.addLinks(links);
  }
}
