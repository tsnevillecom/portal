export type IToast = {
  id: string
  message: string
  type: IToastType
  dismissable: boolean
  time: number
  title?: string | null
}

export type IToastType = 'success' | 'danger' | 'warning' | 'info'
