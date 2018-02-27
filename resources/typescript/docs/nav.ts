class docsNav extends hp.element {
  public created() {
    this.ajax.get('/docs/nav')
  }
  public ajaxResponse(data) {

  }
}

hp.observe('.pure-nav > ul', docsNav)