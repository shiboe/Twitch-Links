import * as React from "react";

import { Link } from '../../classes/link.class';
import { messenger } from '../classes/messenger.class';

interface Props {
  link: Link
}

interface State {
  copied: boolean
}

export class LinkActionsComponent extends React.Component <Props, State> {
  timeout: any;

  constructor(props) {
    super(props);
    this.state = {
      copied: false
    }
  }

  render() {
    return (
      <div className="actions">

        { this.props.link.saved ?
          (
            <a className="unsave action" onClick={ () => this.action('unsave') }>
              <i className="fas fa-bookmark"></i>
              <span>unsave</span></a>
          ) : (
            <a className="save action" onClick={ () => this.action('save') }>
              <i className="fas fa-bookmark"></i>
              <span>save</span></a>
          )
        }

        { this.props.link.hidden ?
            (
              <a className="unhide action" onClick={ () => this.action('unhide') }>
                <i className="fas fa-eye-slash"></i>
                <span>unhide</span></a>
            ) : (
              <a className="hide action" onClick={ () => this.action('hide') }>
                <i className="fas fa-eye-slash"></i>
                <span>hide</span></a>
            )
        }

        <a className="copy action" onClick={ () => this.action('copy') }>
          <i className="fas fa-copy"></i>
          <span>copy</span></a>

        <div className={ this.copyConfirmClasses() }><i className="fas fa-clipboard-check"></i></div>
      </div>
    );
  }

  action(action: string) {
    switch (action) {
      case 'save': return messenger.saveLink(this.props.link.url);
      case 'unsave': return messenger.unSaveLink(this.props.link.url);
      case 'hide': return messenger.hideLink(this.props.link.url);
      case 'unhide': return messenger.unHideLink(this.props.link.url);
      case 'copy': return this.copyToClipboard(this.props.link.url);
    }
  }

  // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
  copyToClipboard = (str) => {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
        : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
      document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
      document.getSelection().addRange(selected);   // Restore the original selection
    }

    this.setState((state, props) => {
      window.clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.setState((state, props) => {
          return {
            copied: false
          }
        });
      }, 400);

      return {
        copied: true
      }
    });
  }

  copyConfirmClasses() {
    return this.state.copied ? `show copy-confirm` : `copy-confirm`;
  }
}
