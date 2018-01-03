class EpisodeNavigatable extends Navigatable {
  constructor() {
    super();
  }

  static get selector() {
    return '.dv-episode-wrap';
  }

  attach(navigatable) {
    console.debug('attatching to episodes:', navigatable);
    let $this = this;
    let episodes = navigatable.find('div.dv-episode-container');

    $this.wireFocus(episodes);

    episodes.on('keydown', function(e) {
      let $item = $(this);
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
    }).each(function() {
      $(this).attr('tabindex', -1);
    });
  }

  focusEpisode(episode) {
    if (episode.length === 0)
      return;
    episode.focus();
    this.setLastSelectedIndex(episode);
  }

  selectItem(item) {
    var selected = this.getLastSelectedIndex(item);
    var nextItem = item.children().get(selected);
    nextItem.focus();

    if (!this.isScrolledIntoView(nextItem)) {
      $.scrollTo(nextItem);
    }
  }

  getLastSelectedIndex(episodeContainer) {
    var index = episodeContainer.attr("amazon-nav-selected-index");
    if(index === undefined)
      return 0;
    return parseInt(index);
  }

  setLastSelectedIndex(episode) {
    let container = episode.parent();
    container.attr("amazon-nav-selected-index", episode.index());
  }
}
