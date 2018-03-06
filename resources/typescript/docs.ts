namespace hpweb {
  class navListLink extends hp.link {
    public created() {
      let path = this.getAttribute('data-href'), urlPath = hp.url.path
      if (path == urlPath && this.hasClass('nav-group')) {
        this.broadcastTo(navListLink, 'unbold')
        // make the item and its upstream nav-group bold
        this.upstream('a.nav-group', item => {
          item.addClass('selected')
          item.parentElement(parent => {
            parent.addClass('pure-nav--active')
          })
        })
      }
    }
    public clicked() {
      // Toggle the activity on the parent li item
      this.parentElement(item => {
        item.findChildElements('.pure-nav--active', item => item.removeClass('pure-nav--active'))
        // if (this.hasClass('nav-group')) {
        item.toggleClass('pure-nav--active')
        // }
      })

      // unbold all links
      this.broadcastTo(navListLink, 'unbold')
      // make the item and its upstream nav-group bold
      this.upstream('a.nav-group', item => {
        item.parentElement(parent => {
          if (parent.hasClass('pure-nav--active')) item.addClass('selected')
        })
      })

      this.parentElement(parent => {
        if (parent.hasClass('pure-nav--active') || parent.parent == null) {
          let tpl = this.getAttribute('data-tpl')
          tpl != '' && this.broadcastTo(doc, 'couple', tpl)
        }
      })
      hp.url.set(this.getAttribute('data-href'))
      if (this.hash.length > 0) {
        hp.url.goto(this.hash)
      }
    }
    public unbold() {
      this.removeClass('selected')
    }
  }

  class doc extends hp.template {
    public bind() {
      let path = hp.url.path.split('/')
      let url = '/home'
      if (path.indexOf('docs') === 1 && path.length > 2) {
        path.splice(1, 1)
        url = path.join('/')
      }
      return {
        templateUrl: '/templates/docs' + url,
        dataUrl: '/data/docs' + url
      }
    }
    public couple(page: string) {
      this.reCouple({
        templateUrl: '/templates/docs' + page,
        dataUrl: '/data/docs' + page
      })
    }
    public postRender() {
      ga('send', 'pageview', window.location.pathname);
      // console.log(adsbygoogle)
      // googletag.pubads().refresh()
    }
  }

  hp.observe('.pure-nav  a', navListLink)
  hp.observe('.doc', doc)
}
