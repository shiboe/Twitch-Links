import * as React from "react";

import { Link } from '../../classes/link.class';
import { LinkComponent } from './link.component';

interface Props {
  links: Link[],
  hidden?: boolean
}

export class ListComponent extends React.Component <Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className={ this.classes() }>
        {this.props.links.map((link) => {
          return <LinkComponent link={ link }/>;
        })}
      </ul>
    );
  }

  classes() {
    let className = 'link-list';

    if (this.props.hidden) className += ' hidden';

    return className;
  }
}
