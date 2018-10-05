import * as React from "react";

interface Props {
  fill: number
}

export class ExpiresBarComponent extends React.Component <Props, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="expires-bar">
      <div style={ this.styles(this.props.fill) } className="progress"></div>
    </div>;
  }

  styles(fill) {
    const percent = 100 - (fill * 100);

    return {
      backgroundColor: percent >= 60 ? 'green' : percent >= 20 ? 'orange' : 'red',
      width: percent.toFixed(2) + '%'
    }
  }
}
