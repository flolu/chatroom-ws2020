export const removeIdProp = <T>(obj: T) => {
  const {_id, ...data} = obj as any
  return data as T
}
