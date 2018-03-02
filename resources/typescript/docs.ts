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
  }

  class beautify extends hp.element {
    public created() {
      this.text = js_beautify(this.text, { indent_size: 2 })
      Prism.highlightElement(this.element)
    }
  }

  hp.observe('.pure-nav > ul li > a', navListLink)
  hp.observe('code.language-javascript', beautify)
  hp.observe('.doc', doc)
}
