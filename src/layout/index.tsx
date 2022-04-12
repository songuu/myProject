import React from 'react'
interface IBaseLayoutProps {}

const BaseLayout: React.FC<IBaseLayoutProps> = () => {
  return <div style={{ minHeight: '100%', width: '100%' }}></div>
}

export default BaseLayout
