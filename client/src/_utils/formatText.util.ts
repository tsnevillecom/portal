export const formatText = (body = '') => {
  return body.replace(
    // eslint-disable-next-line no-control-regex
    new RegExp('\r?\n', 'g'),
    '<br>'
  )
}
