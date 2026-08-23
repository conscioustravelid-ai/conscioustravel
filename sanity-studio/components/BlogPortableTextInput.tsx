import {PortableTextInput, type ArrayOfObjectsInputProps, type PortableTextInputProps} from 'sanity'
import {handleBlogTablePaste} from '../lib/tablePaste'

export function BlogPortableTextInput(props: ArrayOfObjectsInputProps) {
  return <PortableTextInput {...props as unknown as PortableTextInputProps} onPaste={handleBlogTablePaste} />
}
