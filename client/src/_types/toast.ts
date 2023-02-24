export type Toast = {
  id: string
  message: string
  type: ToastType
  dismissable: boolean
  time: number
  title?: string | null
}

export type ToastType = 'success' | 'danger' | 'warning' | 'info'
