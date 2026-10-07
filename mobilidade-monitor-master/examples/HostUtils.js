function getEnvironment() {
  return {
    hosts: {
      version: VERSION,
      local: '/',
      hostRequestApi: '<APIAPP_HOST>',
      hostRequest: '<API_HOST>',
      hostRequestNew: '<API_V2_HOST>',
      hostSite: '<SITE_HOST>',
      hostImageDriver: '<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/driver/profile/compressed/',
      hostImageDriverTemp: '<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/driver/profile/temp/',
      hostDocs: '<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/driver/docs/',
      hostImageClient: '<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/customer/profile/compressed/',
      hostImageDefault: '<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/default.jpg',
      hostImageCentral: '<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/central/',
      hostAudio: '<STORAGE_PRIMARY_HOST>/<BUCKET_NAME>/chat/trip/',
      hostGlobal: '<GLOBAL_HOST>'
    }
  }
}
const VERSION = 'v5.0'
const environment = getEnvironment()
const HOST_PROFILE_DRIVER = environment.hosts.hostImageDriver
const HOST_PROFILE_CLIENT = environment.hosts.hostImageClient
