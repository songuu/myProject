export const getBgOffset: () => string = () => {
  const bgOffsetX = Math.ceil((Math.random() - 0.5) * 800)
  const bgOffsetY = Math.ceil((Math.random() - 0.5) * 600)
  return `${bgOffsetX}px, ${bgOffsetY}px`
}
