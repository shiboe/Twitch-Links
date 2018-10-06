import * as React from "react";

import { Link } from '../../classes/link.class';

import { ExpiresBarComponent } from './expires-bar.component';
import { LinkActionsComponent } from './link-actions.component';

interface State {
  path: string,
  mockLink: Link
}

interface Props {
  url: string,
  type: string
}

export class UrlComponent extends React.Component <Props, State> {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);
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
          href={ this.props.url }
          title={ this.props.url }
          target="_blank">{ this.state.path }</a>
      </div>

      <ExpiresBarComponent/>
      <LinkActionsComponent link={ this.state.mockLink }/>
    </li>;
  }

  stateFromProps(props) {
    const urlParts = this.props.url.split('/');

    return {
      path: urlParts.slice(2).join('/'),
      mockLink: {
        url: this.props.url,
        created: 0,
        saved: props.type === 'saved',
        hidden: props.type === 'hidden'
      }
    };
  }
}
