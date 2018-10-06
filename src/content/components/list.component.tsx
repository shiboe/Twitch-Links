import * as React from "react";

import { Link } from '../../classes/link.class';
import { LinkComponent } from './link.component';
import { UrlComponent } from './url.component';

interface Props {
  links?: Link[],
  urls?: string[],
  type: string
}

export class ListComponent extends React.Component <Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.links) return this.renderLinks();
    if (this.props.urls) return this.renderUrls();
  }

  renderLinks() {
    return (
      <ul className={ this.classes() }>
        {this.props.links.map((link) => {
          return <LinkComponent link={ link }/>;
        })}
      </ul>
    );
  }

  renderUrls() {
    return (
      <ul className={ this.classes() }>
        {this.props.urls.map((url) => {
          return <UrlComponent type={ this.props.type } url={ url }/>;
        })}
      </ul>
    )
  }

  classes() {
    return `link-list ${this.props.type}`;
  }
}
