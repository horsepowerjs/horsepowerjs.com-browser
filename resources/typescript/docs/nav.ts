namespace hpweb {
  class navListLink extends hp.link {
    public clicked() {
      this.parentElement(item => {
        item.toggleClass('pure-nav--active')
        item.findChildElements('.pure-nav--active', item => item.removeClass('pure-nav--active'))
      })
      if (this.hash.length > 0) {
        window.location.href = this.hash
      }
    }
  }

  class doc extends hp.template {
    public bind() {
      return {
        template: '/templates/docs/messages',
        data: '/data/docs/messages'
      }
    }
    public postRender() {
      Prism.highlightAll()
    }
  }

  hp.observe('.pure-nav > ul li > a', navListLink)
  hp.observe('.doc', doc)
}
