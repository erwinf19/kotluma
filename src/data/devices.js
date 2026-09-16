// Logical app-content sizes in dp, not branded physical-screen specifications.
export const devices = [
  { id: 'small', label: 'Phone · Small', width: 320, height: 568 },
  { id: 'phone', label: 'Phone · Standard', width: 360, height: 740 },
  { id: 'tall', label: 'Phone · Tall', width: 393, height: 852 },
  { id: 'large', label: 'Phone · Large', width: 412, height: 915 },
  { id: 'tablet-small', label: 'Tablet · Small', width: 600, height: 960 },
  { id: 'tablet', label: 'Tablet · Large', width: 800, height: 1280 },
]
export function deviceGeometry(device, landscape, availableWidth, availableHeight) {
  const width = landscape ? device.height : device.width
  const height = landscape ? device.width : device.height
  const frameWidth = width + 14, frameHeight = height + 65
  const scale = Math.max(0.01, Math.min(1, Math.max(1, availableWidth - 12) / frameWidth, Math.max(1, availableHeight - 12) / frameHeight))
  return { width, height, frameWidth, frameHeight, scale }
}
