import React from 'react';

interface Iprops {
  visible: boolean;
}

const ContextMenu: React.FC<Iprops> = ({ visible }) => {
  return (
    visible ? <div>
      ContextMenu
    </div> : null
  );
}

export default ContextMenu;
