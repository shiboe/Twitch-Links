import * as React from "react";
import * as ReactDOM from "react-dom";

import OverlayComponent from './components/overlay.component';

import { Reader } from './classes/reader.class';
import { FontAwesome } from './classes/font-awesome.class';

const root = document.createElement('div');
root.id = 'twitchlinks-root';
document.body.appendChild(root);

ReactDOM.render(
<OverlayComponent/>
,
  document.getElementById("twitchlinks-root")
);

const reader = new Reader();
FontAwesome.load();

reader.start();
