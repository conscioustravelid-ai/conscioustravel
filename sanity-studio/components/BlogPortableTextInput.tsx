import {PortableTextInput, type ArrayOfObjectsInputProps, type PortableTextInputProps} from 'sanity'
import {handleBlogPaste} from '../lib/itineraryPaste'

export function BlogPortableTextInput(props: ArrayOfObjectsInputProps) {
  return <PortableTextInput {...props as unknown as PortableTextInputProps} onPaste={handleBlogPaste} />
}
