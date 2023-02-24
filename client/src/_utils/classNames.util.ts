export const classNames = (classes: { [key: string]: boolean | undefined }): string => {
  const filteredClasses = Object.keys(classes).filter((k) => classes[k])
  return filteredClasses.join(' ')
}
