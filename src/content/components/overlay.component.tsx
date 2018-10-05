import * as React from "react";

import { HeaderComponent } from './header.component';
import { ListComponent } from './list.component';
import { Listener } from "../classes/listener.class";
import { Link } from '../../classes/link.class';
import { FooterComponent } from "./footer.component";

interface State {
  links: Link[],
  hiddenLinks: Link[],
  hasUpdate: boolean,
  updatedLinks: Link[]
}

export default class OverlayComponent extends React.Component <{}, State> {
  listener: Listener;

  constructor(props) {
    super(props);
    this.state = {
      links: [],
      hiddenLinks: [],
      hasUpdate: false,
      updatedLinks: []
    };
  }

  componentDidMount() {
    this.listener = new Listener((type, links, force) => {
      this.onMessage(type, links, force);
    });
  }

  componentWillUnmount() {
    this.listener.destroy();
  }

  render() {
    return (
      <div className="twitchlinks-overlay">
        <HeaderComponent/>

        <div className="update-links">
          <a
            className={ this.state.hasUpdate ? 'update-available' : '' }
            onClick={ () => this.state.hasUpdate ? this.updateLinks(): null }>
            <i className="fas fa-sync"></i>
            <span>refresh</span>
          </a>
        </div>

        <div className="link-list-container">
          <ListComponent links={ this.state.links }/>
          <ListComponent hidden={ true } links={ this.state.hiddenLinks }/>
        </div>

        <FooterComponent/>
      </div>
    );
  }

  onMessage(type, links, force) {
    const update = type === 'update' && !force;

    this.setState((state, props) => {
      return {
        links: update ? state.links : this.filterLinks(links),
        hiddenLinks: update ? state.hiddenLinks : this.filterLinks(links, true),
        hasUpdate: update,
        updatedLinks: update ? links : []
      };
    });
  }

  updateLinks() {
    this.setState((state, props) => {
      return {
        links: this.filterLinks(state.updatedLinks),
        hiddenLinks: this.filterLinks(state.updatedLinks, true),
        hasUpdate: false,
        updatedLinks: []
      };
    });
  }

  filterLinks(links: Link[], hidden?: boolean) {
    return links
      .filter((link) => hidden ? link.hidden : !link.hidden)
      .sort((a, b) => b.created - a.created);
  }
}
