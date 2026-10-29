// Preserve component APIs while keeping style-only props out of the DOM.
export const shouldForwardProp = (prop: string) => prop !== 'theme' && !prop.startsWith('$');
