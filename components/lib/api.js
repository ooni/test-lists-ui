export const fetcher = (url, ...args) =>
  fetch(`${process.env.NEXT_PUBLIC_OONI_API}${url}`, ...args).then((res) => {
    if (res.ok) {
      return res.json()
    } else {
      console.log(res)
      throw new Error(`Request Failed: ${res.statusText}`)
    }
  })
