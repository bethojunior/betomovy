class WhatsappSession {
  static CENTRAL_PRODUCT_SUBDOMAIN = 'central'
  static CENTRAL_TENANT_PREFIX = `${WhatsappSession.CENTRAL_PRODUCT_SUBDOMAIN}-`

  static resolveAppNameFromHostname(hostname) {
    const labels = hostname.split('.').filter(Boolean)
    if (labels.length === 0) {
      return ''
    }
    const head = labels[0]
    if (head === WhatsappSession.CENTRAL_PRODUCT_SUBDOMAIN && labels.length > 1) {
      return labels[1]
    }
    if (head.startsWith(WhatsappSession.CENTRAL_TENANT_PREFIX)) {
      return head.slice(WhatsappSession.CENTRAL_TENANT_PREFIX.length)
    }
    return head
  }

  static resolveCentralId() {
    const central = Session.get('centralSelected')
    return central && central.id != null ? central.id : ''
  }

  static buildSessionName() {
    const hostname = window.location.hostname
    if (!hostname) {
      return ''
    }
    const centralId = WhatsappSession.resolveCentralId()
    return centralId !== '' ? `${hostname}-${centralId}` : hostname
  }

  static persistSessionName() {
    const sessionName = WhatsappSession.buildSessionName()
    if (sessionName) {
      localStorage.setItem('sessionName', sessionName)
      localStorage.setItem('appName', sessionName)
    }
    return sessionName
  }

  static getSessionName() {
    const expected = WhatsappSession.buildSessionName()
    if (!expected) {
      return localStorage.getItem('sessionName') || ''
    }
    const cached = localStorage.getItem('sessionName')
    if (cached === expected) {
      return cached
    }
    return WhatsappSession.persistSessionName()
  }
}
