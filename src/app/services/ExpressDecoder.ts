/* eslint-disable @typescript-eslint/no-explicit-any */
import router from '../../router'

const endpoints = []

const decodeRoutes = () : string[] => {
  router.stack.forEach(capture.bind(null, []))
  return endpoints
}

const capture = (path: any, layer: any): void => {
  if (layer.route) {
    layer.route.stack.forEach(capture.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(capture.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    const route = '/' + path.concat(split(layer.regexp)).filter(Boolean).join('/').split('/:')[0]
    if (!endpoints.includes(route)) endpoints.push(route)
  }
}

const split = (thing: any): string | string[] => {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    const match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

export default decodeRoutes
