import React, { useContext } from 'react';
import useInterval from 'react-useinterval';
import { YingContext } from './lib/react-ying';
console.log(111)
export default function Play({ meta, volume: vol = 1 }) {
     const { cache } = useContext(YingContext);
     const { audio, volume = 50, interval = 15 } = meta;
     useInterval(() => {
          // console.log(audio, volume, interval)
          const data = typeof audio === 'string' && audio.length === 128 ? cache[audio] : audio
          if (data) {
               const audioElement = document.createElement("audio");
               audioElement.src = data;
               audioElement.volume = volume * vol * 0.0001;
               audioElement.play();
               // console.log(audio, volume, interval)
          }
     }, interval * 1000);
     return <div />
}