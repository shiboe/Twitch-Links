import * as React from "react";

export class HeaderComponent extends React.Component <{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className="header-container">
        <h1 className="header-logo">Twitchlinks</h1>
      </header>
    );
  }
}
