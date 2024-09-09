
import styles from './../sass/aos.scss';


import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';

import observer from './libs/observer';

import detect from './helpers/detector';
import handleScroll from './helpers/handleScroll';
import prepare from './helpers/prepare';
import elements from './helpers/elements';


let $aosElements = [];
let initialized = false;


let options = {
  offset: 120,
  delay: 0,
  easing: 'ease',
  duration: 400,
  disable: false,
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
  startEvent: 'DOMContentLoaded',
  animatedClassName: 'aos-animate',
  initClassName: 'aos-init',
  useClassNames: false,
  disableMutationObserver: false,
  throttleDelay: 99,
  debounceDelay: 50
};


const isBrowserNotSupported = () => document.all && !window.atob;

const initializeScroll = function initializeScroll() {
  
  $aosElements = prepare($aosElements, options);
  
  handleScroll($aosElements);

  
  window.addEventListener(
    'scroll',
    throttle(() => {
      handleScroll($aosElements, options.once);
    }, options.throttleDelay)
  );

  return $aosElements;
};


const refresh = function refresh(initialize = false) {
  
  if (initialize) initialized = true;
  if (initialized) initializeScroll();
};


const refreshHard = function refreshHard() {
  $aosElements = elements();

  if (isDisabled(options.disable) || isBrowserNotSupported()) {
    return disable();
  }

  refresh();
};


const disable = function() {
  $aosElements.forEach(function(el, i) {
    el.node.removeAttribute('data-aos');
    el.node.removeAttribute('data-aos-easing');
    el.node.removeAttribute('data-aos-duration');
    el.node.removeAttribute('data-aos-delay');

    if (options.initClassName) {
      el.node.classList.remove(options.initClassName);
    }

    if (options.animatedClassName) {
      el.node.classList.remove(options.animatedClassName);
    }
  });
};


const isDisabled = function(optionDisable) {
  return (
    optionDisable === true ||
    (optionDisable === 'mobile' && detect.mobile()) ||
    (optionDisable === 'phone' && detect.phone()) ||
    (optionDisable === 'tablet' && detect.tablet()) ||
    (typeof optionDisable === 'function' && optionDisable() === true)
  );
};
const init = function init(settings) {
  options = Object.assign(options, settings);

  
  $aosElements = elements();

  
  if (!options.disableMutationObserver && !observer.isSupported()) {
    console.info(`
      aos: MutationObserver is not supported on this browser,
      code mutations observing has been disabled.
      You may have to call "refreshHard()" by yourself.
    `);
    options.disableMutationObserver = true;
  }

  
  if (!options.disableMutationObserver) {
    observer.ready('[data-aos]', refreshHard);
  }


  if (isDisabled(options.disable) || isBrowserNotSupported()) {
    return disable();
  }

  
  document
    .querySelector('body')
    .setAttribute('data-aos-easing', options.easing);

  document
    .querySelector('body')
    .setAttribute('data-aos-duration', options.duration);

  document.querySelector('body').setAttribute('data-aos-delay', options.delay);


  if (['DOMContentLoaded', 'load'].indexOf(options.startEvent) === -1) {
    
    document.addEventListener(options.startEvent, function() {
      refresh(true);
    });
  } else {
    window.addEventListener('load', function() {
      refresh(true);
    });
  }

  if (
    options.startEvent === 'DOMContentLoaded' &&
    ['complete', 'interactive'].indexOf(document.readyState) > -1
  ) {
    
    refresh(true);
  }

  
  window.addEventListener(
    'resize',
    debounce(refresh, options.debounceDelay, true)
  );

  window.addEventListener(
    'orientationchange',
    debounce(refresh, options.debounceDelay, true)
  );

  return $aosElements;
};



export default {
  init,
  refresh,
  refreshHard
};
