import React from 'react'

import { BucketMeta } from '@mytypes/common'

type PropTypes = {
  bucketMeta: BucketMeta
}

const Bucket: React.FC<PropTypes> = ({ bucketMeta }) => {
  return <div>Bucket</div>
}

export default Bucket
