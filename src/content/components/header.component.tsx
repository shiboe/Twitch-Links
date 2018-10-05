import * as React from "react";

export class HeaderComponent extends React.Component <{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header className="header-container">
        <h1 className="header-logo">Twitch Links</h1>

        <div className="nav-menu">
          <a onClick={ () => this.viewAll() }>all</a>
          <a onClick={ () => this.viewSaved() }>saved</a>
          <a onClick={ () => this.viewHidden() }>hidden</a>
        </div>
      </header>
    );
  }

  viewAll() {

  }

  viewSaved() {

  }

  viewHidden() {

  }
}
