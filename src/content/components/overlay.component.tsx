import * as React from "react";

import { HeaderComponent } from './header.component';
import { ListComponent } from './list.component';
import { Listener } from "../classes/listener.class";
import { Link } from '../../classes/link.class';
import { FooterComponent } from "./footer.component";

interface State {
  allLinksVisible: Link[],
  allLinksHidden: Link[],
  hasUpdate: boolean,
  updatedLinks: Link[],
  saved: string[],
  hidden: string[],
  showing: string
}

export default class OverlayComponent extends React.Component <{}, State> {
  listener: Listener;

  constructor(props) {
    super(props);
    this.state = {
      allLinksVisible: [],
      allLinksHidden: [],
      hasUpdate: false,
      updatedLinks: [],
      saved: [],
      hidden: [],
      showing: 'all'
    };
  }

  componentDidMount() {
    this.listener = new Listener((payload) => this.onMessage(payload));
  }

  componentWillUnmount() {
    this.listener.destroy();
  }

  render() {
    return (
      <div className="twitchlinks-overlay">
        <HeaderComponent/>

        {this.state.showing === 'all' ? this.renderAll() : null}
        {this.state.showing === 'saved' ? this.renderSaved() : null}
        {this.state.showing === 'hidden' ? this.renderHidden() : null}

        <FooterComponent/>
      </div>
    );
  }

  renderAll() {
    if (this.state.allLinksVisible.length + this.state.allLinksHidden.length > 0) {
      return (
        <div className="all content-container">
          <div className="update-links">
            <a
              className={ this.state.hasUpdate ? 'update-available' : '' }
              onClick={ () => this.state.hasUpdate ? this.updateLinks(): null }>
              <i className="fas fa-sync"></i>
              <span>refresh</span>
            </a>
          </div>

          <div className="link-list-container">
            <ListComponent type="visible" links={ this.state.allLinksVisible }/>
            <ListComponent type="hidden" links={ this.state.allLinksHidden }/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="all content-container">
          <div className="update-links">
            <a
              className={ this.state.hasUpdate ? 'update-available' : '' }
              onClick={ () => this.state.hasUpdate ? this.updateLinks(): null }>
              <i className="fas fa-sync"></i>
              <span>refresh</span>
            </a>
          </div>

          <p className="empty">Twitchlinks reads your current streamer's chat, and displays any links found. Links will stay here for 15 minutes, and are refreshed if reposted. If links are found while this overlay is open, the refresh button above will add them. Cheers!</p>
        </div>
      );
    }
  }

  renderSaved() {
    if (this.state.saved.length) {
      return (
        <div className="saved content-container">
          <div className="link-list-container">
            <ListComponent type="saved" urls={ this.state.saved }/>
          </div>
        </div>
      );
    } else {
      return (
        <p className="empty">Here you will be able to view links that you have saved, but right now, you don't have any.</p>
      )
    }
  }

  renderHidden() {
    if (this.state.hidden.length) {
      return (
        <div className="hidden content-container">
          <div className="link-list-container">
            <ListComponent type="hidden" urls={ this.state.hidden }/>
          </div>
        </div>
      );
    } else {
      return (
        <p className="empty">Here you will be able to view links that you have hidden, but right now, you don't have any.</p>
      )
    }
  }

  onMessage(payload) {
    this.setState((state, props) => {
      const queueUpdate = payload.type === 'updateLinks' && !payload.force;

      return {
        allLinksVisible: payload.links && !queueUpdate ? this.filterLinks(payload.links) : state.allLinksVisible,
        allLinksHidden: payload.links && !queueUpdate ? this.filterLinks(payload.links, true) : state.allLinksHidden,
        hasUpdate: queueUpdate,
        updatedLinks: queueUpdate ? payload.links : [],
        saved: payload.saved || state.saved,
        hidden: payload.hidden || state.hidden,
        showing: payload.type.indexOf('show') === 0 ? payload.type.split('show')[1].toLowerCase() : state.showing
      };
    });
  }

  updateLinks() {
    this.setState((state, props) => {
      return {
        allLinksVisible: this.filterLinks(state.updatedLinks),
        allLinksHidden: this.filterLinks(state.updatedLinks, true),
        hasUpdate: false,
        updatedLinks: [],
        saved: state.saved,
        hidden: state.hidden
      };
    });
  }

  filterLinks(links: Link[], hidden?: boolean) {
    return links
      .filter((link) => hidden ? link.hidden : !link.hidden)
      .sort((a, b) => b.created - a.created);
  }
}
