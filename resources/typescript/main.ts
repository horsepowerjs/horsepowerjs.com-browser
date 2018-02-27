class navburger extends hp.element {
  clicked() {
    this.siblingElement('.pure-navbar--menu', item =>
      item.enableClass(!item.hasClass('pure-navbar--menu_is-active'), 'pure-navbar--menu_is-active'))
  }
}

hp.observe('.pure-navbar--burger', navburger)