class navburger extends hp.element {
  clicked() {
    this.toggleClass('is-active')
    this.closestElement('.navbar', item => {
      item.findElement('.navbar-menu', item => item.toggleClass('is-active'))
    })
  }
}

hp.observe('.navbar-burger', navburger)