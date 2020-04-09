import React from 'react';

import {PlayerMain} from './player.main';

export function Player({trackObj}) {
  return (
    <PlayerProvider>
      <PlayerMain trackObj={trackObj} />
    </PlayerProvider>
  );
}
