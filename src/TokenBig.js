import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import jsonmergepatch from "json-merge-patch";
import React, { useContext, useMemo } from 'react';
import { YingContext } from './lib/react-ying';
console.log(111)
let theme
const useStyles = makeStyles(t => {
     theme = t
     return {
          label: {
               width: 35,
               height: 35,
               fontSize: 20,
          },
          progress: {
               position: 'absolute',
               top: 2,
               left: 0,
          },
          loading: {
               position: 'absolute',
               top: 57,
               left: 57,
          },
          sub: {
               position: 'absolute',
               top: 95,
               width: 150,
               textAlign: 'center',
               color: 'white',
          }
     }
})

export default function Token({ token, onClick, style: rStyle, children, loading, progress, className, subTitle }) {
     const { update, cache } = useContext(YingContext);
     const classes = useStyles()
     const state = useMemo(() => {
          const { profile = {}, image, title: rTitle = ' ' } = token
          const {
               name = rTitle,
               _formalName = name,
               manner = {},
          } = profile
          const {
               avatar,
               themes = {},
               backgroundImage,
               backgroundSize,
               zoom = 100,
               top = 50,
               left = 50,
          } = manner
          const src = avatar ? (avatar.length < 150 ? cache[avatar] : avatar) :
               (image ? image.length < 150 ? cache[image] : image : null)
          const color = themes?.[theme.palette.type]?.token?.color || theme.palette.type === 'light' ? '#000095' : 'white'
          const backgroundColor = themes?.[theme.palette.type]?.token?.backgroundColor
          let bi, bs, bp
          if (src) {
               bi = `url(${src})`
               bs = `${zoom}%`
               bp = `${left}% ${top}%`
          } else {
               bi = `url()`
               bs = '100%'
               bp = '50% 50%'
          }
          const background = backgroundImage ? backgroundImage.length < 150 ? cache[backgroundImage] : backgroundImage : null
          if (background) {
               bi += `,url(${background})`
               bs += `,${backgroundSize}%`
               bp += ',0% 0%'
          }
          const state = {
               label: {
                    backgroundColor,
                    color: color,
               },
               imageReady: !!src,
               title: rStyle ? _formalName.substr(0, 9) : _formalName.substr(0, 1),
               update
          }
          const isSVG = src && src.startsWith('data:image/svg')
          if (!isSVG) state.label.borderRadius = '50%'
          jsonmergepatch.apply(state, rStyle)
          if (src || background) {
               state.label.backgroundImage = bi
               state.label.backgroundSize = bs
               state.label.backgroundPosition = bp
               state.label.backgroundRepeat = 'no-repeat'
          }
          if (progress) {
               state.progress = { variant: 'static', value: progress }
          }
          return state
     }, [token, cache, update, rStyle, progress])
     return (
          <IconButton
               onClick={onClick}
               size='small'
               className={className}
          >
               <div className={classes.label} style={state.label}>
                    {state.imageReady ? ' ' : children ? children : state.title}
               </div>
               {progress && !loading && <CircularProgress
                    size={152}
                    thickness={1}
                    className={classes.progress}
                    {...state.progress}
                    color='secondary'
               />}
               {loading && <CircularProgress size={35} className={classes.loading} disableShrink />}
               {subTitle && <div className={classes.sub}>{subTitle}</div>}
          </IconButton>
     )
}