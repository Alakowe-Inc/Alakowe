type NavigateFn = (path: string) => void

let navigateFn: NavigateFn = (path) => {
  window.location.pathname = path
}

export function setNavigateFn(fn: NavigateFn) {
  navigateFn = fn
}

export function appNavigate(path: string) {
  navigateFn(path)
}
