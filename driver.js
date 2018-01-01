class AmazonKeyboardNav {
  constructor() {
    this.navIndex = 0;
  }

  load() {
    if (window.location.href.startsWith('https://www.amazon.co.uk/')) {
      console.info('AmazonNav: running on page: ' + window.location.href);

      if (!this.attachToPlayPage()) {
        this.attatchToBrowsePage();
      }
    }
  }

  attachToPlayPage() {
    var playButton = $('a.dv-play-btn-content').first();
    var $this = this;

    if (playButton.get()[0] == undefined)
      return false;

    $this.wireFocus($('a.dv-play-btn-content'))
      .on('keydown', function(e) {
        var $item = $(this);
        console.debug(`AmazonNav: key "${e.key}" pressed.`);

        switch (e.key) {
          default: $this.handleDefaultKeys(e, $item);
          break;
        }
      }).attr('tabindex', -1);

    this.addNavIndex('a.dv-play-btn-content');
    this.attachToEpisodes();
    this.attatchToTiles();

    this.selectItem(playButton);

    return true;
  }

  attachToEpisodes() {
    var episodes = $('.dv-episode-wrap');
    if (episodes.length == 0)
      return;

    var $this = this;
    console.info('AmazonNav: attatching to episodes');

    $this.wireFocus(episodes.find('div.dv-episode-container'));
    $this.addNavIndex(episodes);

    episodes.on('keydown', 'div.dv-episode-container', function(e) {
      var $item = $(this);
      console.debug(`AmazonNav: key "${e.key}" pressed.`);

      switch (e.key) {
        case "ArrowRight":
          $this.focusEpisode($item.next());
          e.preventDefault();
          break;
        case "ArrowLeft":
          $this.focusEpisode($item.prev());
          e.preventDefault();
          break;
        default: $this.handleDefaultKeys(e, $item);
      }
    }).children('div.dv-episode-container').each(function() {
      $(this).attr('tabindex', -1);
    });
  }

  focusEpisode(episode) {
    if (episode.length === 0)
      return;
    episode.focus();
  }

  handleDefaultKeys(e, $item) {
    switch (e.key) {
      case "Enter":
        this.simulateClick($item.find('a').get()[0]);
        e.preventDefault();
        break;
      case "ArrowDown":
        this.move($item, 1);
        e.preventDefault();
        break;
      case "ArrowUp":
        this.move($item, -1);
        e.preventDefault();
        break;
    }
  }

  attatchToBrowsePage() {
    this.attatchToTiles();
    this.selectItem($('ul.dv-shelf').first());
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

  addNavIndex(selector) {
    var $this = this;
    $(selector).each(function() {
      $(this).attr('amazon-nav-index', ++$this.navIndex);
    });
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

  attatchToTiles() {
    console.info('AmazonNav: attatching to list items');
    var $this = this;

    $this.wireFocus($('ul.dv-shelf').find("li"));

    $('ul.dv-shelf').on('keydown', 'li', function(e) {
      var $item = $(this);
      console.debug(`AmazonNav: key "${e.key}" pressed.`);

      switch (e.key) {
        case "ArrowRight":
          $this.focusShelfItem($item.next());
          e.preventDefault();
          break;
        case "ArrowLeft":
          $this.focusShelfItem($item.prev());
          e.preventDefault();
          break;
        default:
          $this.handleDefaultKeys(e, $item);
          break;
      }
    }).children('li').each(function() {
      $(this).attr('tabindex', -1);
    });
    $this.addNavIndex('ul.dv-shelf');
  }

  move(currentItem, direction) {
    if (currentItem.length === 0)
      return;
    var index = this.getIndex(currentItem) + direction;
    var nextItem = $(`[amazon-nav-index*='${index}']`);
    if (nextItem.length > 0 && index > 0) {
      this.selectItem(nextItem);
    }
  }

  getIndex(item) {
    var e = item;
    var i;
    do {
      i = e.attr("amazon-nav-index");
      e = e.parent();
    } while (i == undefined && e != undefined);
    return parseInt(i);
  }

  selectItem(item) {
    var nextItem = item;
    if (this.isShelf(item) || this.isEpisodeList(item))
      nextItem = item.children().first();

    nextItem.focus();

    if (!this.isScrolledIntoView(nextItem.get()[0])) {
      $.scrollTo(nextItem);
    }
  }

  isShelf(item) {
    return item.is('ul.dv-shelf');
  }

  isEpisodeList(item) {
    return item.is('.dv-episode-wrap');
  }

  // moveShelf(shelfItem, direction) {
  //   if (shelfItem.length === 0)
  //     return;
  //   var shelf = shelfItem.parent();
  //   var index = parseInt(shelf.attr("amazon-nav-index")) + direction;
  //   var nextShelf = $(`ul.dv-shelf[amazon-nav-index*='${index}']`);
  //   if (nextShelf.length > 0 && index > 0) {
  //     var nextItem = nextShelf.children().first();
  //     nextItem.focus();
  //     if (!this.isScrolledIntoView(nextItem.get()[0])) {
  //       $.scrollTo(nextItem);
  //     }
  //   }
  // }

  isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) &&
      (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  focusShelfItem(shelfItem) {
    if (shelfItem.length === 0)
      return;
    shelfItem.focus();
    this.ensureVisible(shelfItem);
  }

  ensureVisible(shelfItem) {
    var shelf = shelfItem.parent();
    var left = shelfItem.position().left + shelf.position().left;
    var parentWidth = shelf.parent().width();

    if ((left + shelfItem.width()) > parentWidth)
      this.scrollShelfRight(shelfItem);
    else if (left < 0)
      this.scrollShelfLeft(shelfItem);
  }

  scrollShelfRight(shelfItem) {
    this.scrollShelf('right', shelfItem);
  }

  scrollShelfLeft(shelfItem) {
    this.scrollShelf('left', shelfItem);
  }

  scrollShelf(direction, shelfItem) {
    console.debug(`AmazonNav: scrolling shelf ${direction}`);
    var scrollButton = shelfItem.parent().siblings(`a[data-direction*='${direction}']`);
    // if()
    // dv-carousel-control-inactive
    this.simulateClick(scrollButton.get()[0]);
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
}

(new AmazonKeyboardNav()).load();
