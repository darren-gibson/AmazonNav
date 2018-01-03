class AmazonNav {
  constructor() {
    this.navIndex = 0;
    this.navMap = new Map([
      [ShelfNavigatable.selector, new ShelfNavigatable()],
      [PlayerNavigatable.selector, new PlayerNavigatable()],
      [EpisodeNavigatable.selector, new EpisodeNavigatable()]
    ]);
  }

  attach() {
    chrome.runtime.onMessage.addListener(
      function(message, sender, sendResponse) {
        this.onMessage(message, sender, sendResponse);
      }.bind(this), false);
    this.attachToDocument();
    this.addDefaultKeySupport();
    this.select(1);
  }

  attachToDocument() {
    let $this = this;
    let navigatables = $(Array.from(this.navMap.keys()).join(','));

    navigatables.each(function() {
      $this.attachToNavigatable($(this));
    });
  }

  addDefaultKeySupport() {
    let $this = this;
    $(window).on('keydown', function(e) {
      console.debug(`AmazonNav: key "${e.key}" pressed.`);

      switch (e.key) {
        case "Backspace":
          window.history.back();
          e.preventDefault();
          break;
        case "ArrowDown":
        case "ArrowUp":
          // Ensure we have some focus if possible
          if($this.select($this.currentIndex))
            e.preventDefault();
          break;
      }
    });
  }

  onMessage(message, sender, sendResponse) {
    switch (message.type) {
      case "webRequest_onCompleted":
        this.attachToDocument();
        break;
      default:
        console.warn(`Unknown message received from ${sender}: `, message);
    }
  }

  attachToNavigatable(navigatable) {
    let $this = this;
    if (navigatable.attr('amazon-nav-index') === undefined) {
      navigatable.attr('amazon-nav-index', ++this.navIndex);
      navigatable.on('keydown', function(e) {
        var $item = $(this);
        console.debug(`AmazonNav: key "${e.key}" pressed.`);

        switch (e.key) {
          case "ArrowDown":
            $this.move($item, 1);
            e.preventDefault();
            break;
          case "ArrowUp":
            $this.move($item, -1);
            e.preventDefault();
            break;
        }
      });
      this.findNavigatableForElement(navigatable).attach(navigatable);
    }
  }

  findNavigatableForElement(element) {
    for (var [selector, value] of this.navMap.entries()) {
      if (element.is(selector)) {
        return value;
      }
    }
    throw new TypeError(`Navigatable for element not found: ${element}`);
  }

  move(currentItem, direction) {
    if (currentItem.length === 0)
      return;
    this.select(this.getIndex(currentItem) + direction);
  }

  select(index) {
    let nextItem = $(`[amazon-nav-index*='${index}']`);
    if (nextItem.length > 0 && index > 0) {
      this.currentIndex = index;
      this.findNavigatableForElement(nextItem).selectItem(nextItem);
      return true;
    }
    return false;
  }

  getIndex(e) {
    return parseInt(e.attr("amazon-nav-index"));
  }
}

(new AmazonNav()).attach();
