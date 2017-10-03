/**
 * @description Utility functions for announcing things in a page. This is used for accessibility where screen readers will read the message to the user as you call the announce functions. Behind the scenes we are using aria live regions. See Aria Live MDN for additional references around this topic.
 * You should use it carefully, if you add too many announcements it will definitely upset users. Few use cases where it is useful: page loads for single page apps, alerts, notifications, and things that are dynamically added to the page that users with disabilities will have issues locating.
 * 
 * @example 
 * import { announce, announcePageLoaded } from 'grommet/utils/Announcer';
 * 
 * export default class Dashboard extends Component {
 * 
 *   componentDidMount () {
 *     announce('Dashboard was loaded');
 *     // or announcePageLoaded('Dashboard');
 *   }
 * 
 * })
 */
// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import CSSClassnames from './CSSClassnames';

const CLASS_ROOT = CSSClassnames.APP;

function clearAnnouncer() {
  const announcer = document.querySelector(`.${CLASS_ROOT}__announcer`);
  if(announcer) {
    announcer.innerHTML = '';
  }
};

/**
 * @property {function} announcePageLoaded - Announces a page load with a given title.
 * @param {string} title 
 */
export function announcePageLoaded (title) {
  announce(`${title} page was loaded`);
}

/**
 * @property {function} announce - Adds a message to be announced. Mode is optional with default value being 'assertive'. You can use mode polite to wait until the screen reader finishes the current message to read the next one.
 * @param {string} message 
 * @param {string} mode 
 */

export function announce (message, mode = 'assertive') {
  const announcer = document.querySelector(`.${CLASS_ROOT}__announcer`);
  if(announcer) {
    announcer.setAttribute('aria-live', 'off');
    announcer.innerHTML = message;
    setTimeout(clearAnnouncer, 500);
    announcer.setAttribute('aria-live', mode);
  }
}

export default { announce, announcePageLoaded };
