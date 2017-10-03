// (C) Copyright 2014 Hewlett Packard Enterprise Development LP

/*
 * Responsive is a utility for tracking the display size.
 * It aligns with CSS media queries.
 * 
 */

/**
 * @description Utility function for being notified when the window size crosses the threshold between mobile and desktop. In general, grommet components take care of handling responsiveness within themselves. But, sometimes there are situations that require custom responsive handling. Using this utility guarantees that your changes will be in sync with the grommet ones at the same breakpoint.
 * @example 
 *
 * import Responsive from 'grommet/utils/Responsive';
 * 
 * export default class Dashboard extends Component {
 * 
 *   constructor() {
 *     super();
 *     this._onResponsive = this._onResponsive.bind(this);
 *     this.state = {};
 *   }
 * 
 *   componentDidMount () {
 *     this._responsive = Responsive.start(this._onResponsive);
 *   }
 * 
 *   componentWillUnmount {
 *     this._responsive.stop();
 *   }
 * 
 *   _onResponsive(small) {
 *     this.setState({ small });
 *   }
 * 
 * })
*/

const SMALL_WIDTH_EM = 44.9375; // align with _settings.responsive.scss

export function smallSize () {
  var fontSize = '16px';
  // unit tests don't have getComputedStyle
  if (window.getComputedStyle) {
    fontSize = window.getComputedStyle(document.documentElement).fontSize;
  }
  return SMALL_WIDTH_EM * parseFloat(fontSize);
}

export default {

  // Track responsive sizing.
  //
  // Example:
  // inside componentDidMount()
  //   this._responsive = Responsive.start(this._onResponsive);
  // inside componentWillUnmount()
  //   this._responsive.stop()

  /**
   * @property {function} start - Called when the browser window size crosses the threshold between mobile and desktop. The argument is true when mobile and false when desktop.
   * 
   */
  start (func) {
    var responsive = {
      func: func,
      timer: undefined,
      small: undefined,
      smallSize: this.smallSize()
    };
    responsive.onResize = this._onResize.bind(this, responsive);
    responsive.layout = this._check.bind(this, responsive);
    responsive.stop = this._stop.bind(this, responsive);
    window.addEventListener('resize', responsive.onResize);
    responsive.layout();
    return responsive;
  },

  _stop (responsive) {
    clearTimeout(responsive.timer);
    window.removeEventListener('resize', responsive.onResize);
  },

  _onResize (responsive) {
    // Don't debounce so we align more closely with how the stylesheets are
    // processed.
    responsive.layout();
  },

  _check (responsive) {
    if (window.innerWidth <= responsive.smallSize) {
      if (! responsive.small) {
        responsive.small = true;
        responsive.func(true);
      }
    } else {
      if (false !== responsive.small) {
        responsive.small = false;
        responsive.func(false);
      }
    }
  },

  smallSize
};
