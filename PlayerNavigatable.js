class PlayerNavigatable extends Navigatable {
  constructor() {
    super();
  }

  static get selector() {
    return 'a.dv-play-btn-content';
  }

  attach(navigatable) {
    console.debug('attatching to Player:', navigatable);
    var $this = this;

    $this.wireFocus(navigatable).on('keydown', function(e) {
      var $item = $(this);
      console.debug(`AmazonNav: key "${e.key}" pressed.`);

      switch (e.key) {
        default: $this.handleDefaultKeys(e, $item);
        break;
      }
    }).attr('tabindex', -1);
  }

  selectItem(item) {
    item.focus();

    if (!this.isScrolledIntoView(item.get()[0])) {
      $.scrollTo(item);
    }
  }
}
