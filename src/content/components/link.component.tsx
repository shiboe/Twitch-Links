import * as React from "react";

import { Link, maxDuration } from '../../classes/link.class';

import { ExpiresBarComponent } from './expires-bar.component';
import { LinkActionsComponent } from './link-actions.component';

interface State {
  path: string,
  ago: string,
  duration: number
}

interface Props {
  link: Link
}

export class LinkComponent extends React.Component <Props, State> {
  interval: any;

  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((state, props) => {
        return this.stateFromProps(props);
      });
    }, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  componentWillReceiveProps() {
    this.setState((state, props) => {
      return this.stateFromProps(props);
    });
  }

  render() {
    return <li className="link-container">
      <div className="path">
        <a
          href={ this.props.link.url }
          title={ this.props.link.url }
          target="_blank">{ this.state.path }</a>
      </div>

      <ExpiresBarComponent fill={ this.state.duration }/>
      <span className="posted-ago">{ this.state.ago }</span>
      <LinkActionsComponent link={ this.props.link }/>
    </li>;
  }

  getTimeFromNow(time): string {
    const seconds = Math.floor((Date.now() - time) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes/60);

    if (seconds < 60) return `mere seconds ago`;
    if (seconds < 120) return `a minute ago`;
    if (seconds < 3600) return `${minutes} minutes ago`;
    if (minutes < 120) return `an hour ago`;

    return `${hours} hours ago`;
  }

  stateFromProps(props) {
    const urlParts = this.props.link.url.split('/');

    return {
      path: urlParts.slice(2).join('/'),
      ago: this.getTimeFromNow(this.props.link.created),
      duration: (Date.now() - this.props.link.created) / maxDuration
    };
  }
}
