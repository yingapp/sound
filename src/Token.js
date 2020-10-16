import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useMemo } from 'react';
import jsonmergepatch from "json-merge-patch";
import {  YingContext,getToken } from './lib/react-ying';
console.log(111)
let theme
const useStyles = makeStyles(t => {
     theme = t
     return {
          avatar: {
               width: 50,
               height: 50,
               ...getToken(theme),
          },
          label: {
               fontSize:20,
          },
     }
})

export default function Token({ token, onClick, style: rStyle,children, className  }) {
     const { update, cache } = useContext(YingContext);
     const classes = useStyles()
     const state = useMemo(() => {
          const { profile = {} } = token
          const {
               name = '　',
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
          const src = avatar ? avatar.length < 150 ? cache[avatar] : avatar : null
          const color = themes?.[theme.palette.type]?.token?.color
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
          const style = {
               avatar: {
                    backgroundColor,
               },
               label: {
                    color: color,
               },
               imageReady: !!src,
               title: rStyle ? _formalName : _formalName.substr(0, 1),
               update
          }
          const isSVG = src && src.startsWith('data:image/svg')
          if (!isSVG) style.avatar.borderRadius = '50%'
          if (color) style.avatar.color = color
          if (backgroundColor) style.avatar.backgroundColor = backgroundColor
          jsonmergepatch.apply(style, rStyle)
          if (src || background) {
               style.avatar.backgroundImage = bi
               style.avatar.backgroundSize = bs
               style.avatar.backgroundPosition = bp
               style.avatar.backgroundRepeat = 'no-repeat'
          }
          return style
     }, [token, cache, update, rStyle])
     return (
          <IconButton
               onClick={onClick}
               classes={{ root: classes.avatar }}
               className={className}
               style={state.avatar}
          >
               {state.imageReady ? '' : children ? children : <div className={classes.label} style={state.label}>{state.title}</div>}
          </IconButton>
     )
}