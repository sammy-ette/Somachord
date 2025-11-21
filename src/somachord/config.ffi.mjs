export function get(key) {
    if(!window.somachordConfig) {return ''}
    return window.somachordConfig[key] || ''
}
