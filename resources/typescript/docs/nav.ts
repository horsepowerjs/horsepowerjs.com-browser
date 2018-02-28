class docNavListItem extends hp.link {
  clicked() {
    this.parentElement(item => {
      item.toggleClass('pure-nav--active')
      item.findChildElements('.pure-nav--active', item => item.removeClass('pure-nav--active'))
    })
    if (this.hash.length > 0) window.location.href = this.hash
  }
}

hp.observe('.pure-nav > ul li > a', docNavListItem)