class Navigatable {
  constructor() {
    // if (this.selector === undefined) {
    //   throw new TypeError("Must override method");
    // }
  }

  handleDefaultKeys(e, $item) {
    switch (e.key) {
      case "Enter":
        this.simulateClick($item.find('a').get()[0]);
        e.preventDefault();
        break;
    }
  }

  wireFocus(elems) {
    var $this = this;
    elems.on('focus', function() {
      var $item = $(this);
      $this.setFocus($item);
    }).on('blur', function() {
      var $item = $(this);
      $this.removeFocus($item);
    });
    return elems;
  }

  setFocus(e) {
    console.debug('AmazonNav: focus changed to: ', e.get()[0]);
    // $('.azn-active').removeClass('azn-active');
    e.addClass('azn-active');
  }

  removeFocus(e) {
    console.debug('AmazonNav: focus removed from: ', e.get()[0]);
    e.removeClass('azn-active');
  }

  simulateClick(elem) {
    var event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    var cancelled = !elem.dispatchEvent(event);
    if (cancelled) {
      // A handler called preventDefault.
      console.debug('AmazonNav: click event cancelled.')
    } else {
      // None of the handlers called preventDefault.
      console.debug('AmazonNav: click event not cancelled.')
    }
  }

  isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) &&
      (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }
}
