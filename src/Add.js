import * as mmb from 'music-metadata-browser';
import ExifReader from 'exifreader';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import React, { useContext } from 'react';
import { YingContext, getFab } from './lib/react-ying/index';
console.log(111)
const useStyles = makeStyles((theme) => ({
     root: {
     },
     input: {
          display: 'none',
     },
     fab: {
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(3),
          ...getFab(theme)
     },
}));
let json, index
export default function Add() {
     const classes = useStyles();
     const { sendData, sendIntent } = useContext(YingContext);
     const add = (event) => {
          const files = [...event.target.files]
          index = files.length
          files.forEach(file => {
               const reader = new FileReader()
               const id = file.name.split('.')[0] //文件前缀
               const type = file.type.split('/')[0]
               reader.onload = function () {
                    const { result } = reader
                    if (type === 'audio') {
                         mmb.parseBlob(file).then(metadata => {
                              const {
                                   common: {
                                        artist,
                                        genre = [],
                                        title = id
                                   },
                                   format: {
                                        duration
                                   }
                              } = metadata
                              onAdd({ [id]: { title, artist, genre, audio: result, duration, interval: duration.toFixed(2) } })
                         })
                    } else if (type === 'image') {
                         const data = {}
                         try {
                              var buffer = new Buffer(result.split(",")[1], 'base64');
                              const tags = ExifReader.load(buffer);
                              const {
                                   'Image Width': { value: width },
                                   'Image Height': { value: height }
                              } = tags
                              data.size = { width, height }
                         } catch (error) {
                         }
                         data.image = result
                         onAdd({ [id]: data })
                    } else if (type === 'video') {
                         onAdd({ [id]: { video: result } })
                    } else if (type === 'text') {
                         onAdd({ [id]: { text: result } })
                    } else if (type === 'application') {
                         json = JSON.parse(result.replace(/\n/g, "").replace(/\r/g, ""))
                         onAdd()
                    }
               }
               if (file) {
                    if (type === 'application' || type === 'text') {
                         reader.readAsText(file)
                    } else {
                         reader.readAsDataURL(file);
                    }
               }
          });
     }
     const onAdd = (meta) => {
          if (meta) sendData({ metas: meta })
          index--
          if (index === 0 && json) {
               setTimeout(() => {
                    sendIntent(json)
               }, 5000)
          }
     }
     return (
          <div className={classes.root}>
               <input
                    accept="audio/*,image/*,text/*,video/*,application/json"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={add}
               />
               <label htmlFor="contained-button-file">
                    <Fab color='inherit' className={classes.fab} component="span">
                         <AddIcon />
                    </Fab>
               </label>

          </div>
     );
}