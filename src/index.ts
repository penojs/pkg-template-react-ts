export { default } from './Simple'

export function extend(target = {}, source = {}) {
    return { ...target, ...source }
}
