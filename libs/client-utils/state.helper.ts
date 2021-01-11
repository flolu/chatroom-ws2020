export enum LoadStatus {
  Error = -1,
  None = 0,
  Loading = 1,
  Loaded = 2,
}

export interface StatusState {
  status: LoadStatus
  error: string | undefined
}

export const initialStatus: StatusState = {
  status: LoadStatus.None,
  error: undefined,
}

export const loadingStart: StatusState = {
  status: LoadStatus.Loading,
  error: undefined,
}

export const loadingDone: StatusState = {
  status: LoadStatus.Loaded,
  error: undefined,
}

export const loadingFail = (error: string) => ({
  status: LoadStatus.Error,
  error,
})
