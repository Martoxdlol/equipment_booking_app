function hashCode(s: string) {
  // https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
  let h = 0
  const l = s.length
  let i = 0;
  if (l > 0)
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  if (h < 0) return -h
  return h;
}

function selectColor(colorNum: number, colors: number) {
  // https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans/10014411
  if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
  return `hsl(${colorNum * (360 / colors) % 360},100%,40%)`;
}

export function stringToColor(name: string) {
  return selectColor(hashCode(name) % 1000, 1000)
}