import React, {useEffect} from 'react';
import {View} from 'react-native';
import {PlayerMain} from '../Player/player.main';
import {commonStyles} from '../common/styles';
import {PlayerProvider} from '../../contexts/player.context';

export function Home() {
  useEffect(() => {
    console.log('Rendering Main.js');
  }, []);

  return (
    <View style={commonStyles.screenStyle}>
      <PlayerProvider>
        <PlayerMain
          trackObj={{
            id: '',
            songUrl:
              'https://r9---sn-ci5gup-h55z.googlevideo.com/videoplayback?expire=1587255107&ei=40KbXreLKqm0z7sP-aGUuAc&ip=122.164.188.143&id=o-AExaVZuO-UMfaQMBmobm8sw8ryAcpz6cmz3JwQZwp6pl&itag=251&source=youtube&requiressl=yes&mh=i-&mm=31%2C26&mn=sn-ci5gup-h55z%2Csn-cvh76nes&ms=au%2Conr&mv=m&mvi=8&pl=20&initcwndbps=378750&vprv=1&mime=audio%2Fwebm&gir=yes&clen=4784460&dur=272.581&lmt=1541049489984017&mt=1587233427&fvip=5&keepalive=yes&fexp=23882514&c=WEB&txp=5411222&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=ALrAebAwRQIgUFA8S9_xRmuslgEWmiXH5yg8gWE737tR4_z8XJZtAT4CIQCITPuJEpXKnaC1QwIpcsHiPr87QP2T00a0qlsu7MYeug%3D%3D&sig=AJpPlLswRQIgStSD-pYk0u0zpP_4UCO7SAnGCUMf_UnHo3mbPh9oFP0CIQDhLOAudFBfo7hRUwTq1A1-h-kM0ye17Gsg8nXSgBm5sg==&ratebypass=yes',
          }}
        />
      </PlayerProvider>
    </View>
  );
}
