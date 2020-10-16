import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { YingContext, getToken } from './lib/react-ying';
console.log(111)
const useStyles = makeStyles((theme) => ({
  root: {
    width: 150,
    height: 150,
    ...getToken(theme),
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  loading: {
    position: 'absolute',
    top: 57,
    left: 57,
  }
}));

export default function Token({ meta, id }) {
  const classes = useStyles();
  const { cache, showDialog } = useContext(YingContext);
  if (!meta) return null
  const { title = id, image, audio, } = meta;
  const src = typeof image === 'string' && image.length === 128 ? cache[image] : image
  const data = typeof audio === 'string' && audio.length === 128 ? cache[audio] : audio
  const handleClick = () => {
    const src = typeof image === 'string' && image.length < 35 ? cache[image] : image
    const chat = {
      id: 'sound',
      intentId: 'chat',
      inner: {
        option: {
          title,
          avatar: src,
          type: 'simple',
        },
        bot: {
          id: '_sound',
          profile: {
            name: '声音',
            manner: {
              avatar: image,
              themes: {
                light: {
                  bubble: {
                    color: '#fff',
                    backgroundColor: 'green'
                  },
                  avatar: {
                    color: '#fff',
                    backgroundColor: 'hotpink'
                  },
                },
                dark: {
                  bubble: {
                    color: '#fff',
                    backgroundColor: 'green'
                  },
                  avatar: {
                    color: '#fff',
                    backgroundColor: 'hotpink'
                  },
                },
              }
            }
          }
        },
        guide: [
          {
            id: 'update',
            path: '/update',
            message: `请按提示修改`,
          },
        ],
        menu: [
          {
            id: 'update',
            path: '/update',
            message: '修改',
          },
        ],
        stepsData: {
          update: [
            {
              path: 'data/metas/' + id,
              fields: { interval: '间隔，单位：秒', volume: '音量，范围：1-100', title: '标题', audio: '声音', image: '图片' }
            }
          ]
        }
      },
    }
    showDialog(chat);
  }
  return (
    <IconButton aria-label="delete" className={classes.root} onClick={handleClick}>
      {image ? <img src={src} alt={title} className={classes.avatar} /> : <div>{title}</div>}
      {!data && <Fade in={true} timeout={15000}><CircularProgress size={35} className={classes.loading} disableShrink /></Fade>}
    </IconButton>
  );
}
