export function parseCookies(cookieHeader: string | undefined) {
  if (!cookieHeader) return {}
  let list: Record<string, string> = {}
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=')
    list[parts!.shift()!.trim()] = decodeURI(parts.join('='))
  })
  return list
}
