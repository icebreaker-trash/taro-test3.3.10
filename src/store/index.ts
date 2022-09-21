const files = require.context('./modules', false, /\.ts$/)
const modules = {}
files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default
})

export default modules