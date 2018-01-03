class ShelfNavigatable extends Navigatable {
  constructor() {
    super();
  }

  static get selector() {
    return 'ul.dv-shelf';
  }

  attach(navigatable) {
    console.debug('attatching to shelfItems:', navigatable);
    var $this = this;
    let shelfItems = navigatable.find("li");

    $this.wireFocus(shelfItems);

    shelfItems.on('keydown', function(e) {
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
    }).each(function() {
      $(this).attr('tabindex', -1);
    });
  }

  focusShelfItem(shelfItem) {
    if (shelfItem.length === 0)
      return;
    shelfItem.focus();
    this.setLastSelectedIndex(shelfItem);

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
    this.simulateClick(scrollButton.get()[0]);
  }

  selectItem(item) {
    var selected = this.getLastSelectedIndex(item);
    var nextItem = item.children().get(selected);
    nextItem.focus();

    if (!this.isScrolledIntoView(nextItem)) {
      $.scrollTo(nextItem);
    }
  }

  getLastSelectedIndex(shelf) {
    var index = shelf.attr("amazon-nav-selected-index");
    if(index === undefined)
      return 0;
    return parseInt(index);
  }

  setLastSelectedIndex(shelfItem) {
    let shelf = shelfItem.parent();
    shelf.attr("amazon-nav-selected-index", shelfItem.index());
  }
}
