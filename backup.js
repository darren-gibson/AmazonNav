class AmazonKeyboardNav {
  constructor() {
  }
}

function load() {
  if (window.location.href.startsWith('https://www.amazon.co.uk/')) {
    console.info('AmazonNav: running on page: ' + window.location.href);

    if (!attachToPlayPage())
      attatchToTiles();
  }
}

function attachToPlayPage() {
  var playButton = $('a.dv-play-btn-content').first();

  if (playButton.get()[0] == undefined)
    return false;

  $('a.dv-play-btn-content').on('focus', function() {
    $this = $(this);
    setFocus($this);
    // $this.closest('div.container').scrollTop($this.index() * $this.outerHeight());
  }).on('keydown', function(e) {
    $this = $(this);
    console.debug(`AmazonNav: key "${e.key}" pressed.`);

    switch (e.key) {
      case "Enter":
        simulateClick($this.find('a').get()[0]);
        e.preventDefault();
        break;
    }
  }).attr('tabindex', -1).first().focus();

  addNavIndex('a.dv-play-btn-content');


  return true;
}

function addNavIndex(selector) {
  var index = 0;
  $(selector).each(function() {
    $(this).attr('amazon-nav-index', ++index);
  });
}

function setFocus(e) {
  console.info('AmazonNav: focus changed to: ', e);
  $('.azn-active').removeClass('azn-active');
  $this.addClass('azn-active');
}

function attatchToTiles() {
  console.info('AmazonNav: attatching to list items');
  $('ul.dv-shelf').on('focus', 'li', function() {
    $this = $(this);
    console.info('AmazonNav: focus changed to: ', this);
    $('li.dv-shelf-item').removeClass('azn-active');
    $this.addClass('azn-active');
    // $this.closest('div.container').scrollTop($this.index() * $this.outerHeight());
  }).on('keydown', 'li', function(e) {
    $this = $(this);
    console.debug(`AmazonNav: key "${e.key}" pressed.`);

    switch (e.key) {
      case "ArrowRight":
        focusShelfItem($this.next());
        e.preventDefault();
        break;
      case "ArrowLeft":
        focusShelfItem($this.prev());
        e.preventDefault();
        break;
      case "ArrowDown":
        moveShelf($this, 1);
        e.preventDefault();
        break;
      case "ArrowUp":
        moveShelf($this, -1);
        e.preventDefault();
        break;
      case "Enter":
        simulateClick($this.find('a').get()[0]);
        e.preventDefault();
        break;
    }

  }).children('li').each(function() {
    $(this).attr('tabindex', -1);
  });
  addNavIndex('ul.dv-shelf');

  $('ul.dv-shelf').first().children().first().focus();
}

function moveShelf(shelfItem, direction) {
  if (shelfItem.length === 0)
    return;
  var shelf = shelfItem.parent();
  var index = parseInt(shelf.attr("amazon-nav-index")) + direction;
  var nextShelf = $(`ul.dv-shelf[amazon-nav-index*='${index}']`);
  if (nextShelf.length > 0 && index > 0) {
    var nextItem = nextShelf.children().first();
    nextItem.focus();
    if (!isScrolledIntoView(nextItem.get()[0])) {
      $.scrollTo(nextItem);
    }
  }
}

function isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) &&
    (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function focusShelfItem(shelfItem) {
  if (shelfItem.length === 0)
    return;
  shelfItem.focus();
  ensureVisible(shelfItem);
}

function ensureVisible(shelfItem) {
  var shelf = shelfItem.parent();
  var left = shelfItem.position().left + shelf.position().left;
  var parentWidth = shelf.parent().width();

  if ((left + shelfItem.width()) > parentWidth)
    scrollShelfRight(shelfItem);
  else if (left < 0)
    scrollShelfLeft(shelfItem);
}

function scrollShelfRight(shelfItem) {
  scrollShelf('right', shelfItem);
}

function scrollShelfLeft(shelfItem) {
  scrollShelf('left', shelfItem);
}

function scrollShelf(direction, shelfItem) {
  console.debug(`AmazonNav: scrolling shelf ${direction}`);
  var scrollButton = shelfItem.parent().siblings(`a[data-direction*='${direction}']`);
  // if()
  // dv-carousel-control-inactive
  simulateClick(scrollButton.get()[0]);
}

function simulateClick(elem) {
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

load();
