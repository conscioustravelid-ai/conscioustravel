import {useEffect, useState} from 'react'
import {type DocumentActionComponent, useDocumentOperation} from 'sanity'
import {resolvePublicationDate} from '../lib/publication-date'

export const PublishNowAction: DocumentActionComponent = (props) => {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (isPublishing && !props.draft) setIsPublishing(false)
  }, [isPublishing, props.draft])

  return {
    disabled: Boolean(publish.disabled) || isPublishing,
    label: isPublishing ? 'Publishing…' : 'Publish Now',
    onHandle: () => {
      const nowIso = new Date().toISOString()
      const currentValue = props.draft?.publishedAt ?? props.published?.publishedAt
      const publishedAt = resolvePublicationDate(currentValue, nowIso)

      setIsPublishing(true)
      patch.execute([{set: {publishedAt}}])
      publish.execute()
      props.onComplete()
    },
  }
}
