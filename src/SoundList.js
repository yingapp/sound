import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useState,useMemo } from 'react';
import Add from './Add';
import useDeepEffect from "./lib/deeply-checked-effect";
import { YingContext } from './lib/react-ying/index';
import Play from './Play';
import Refresh from './Refresh';
import Profile from './Profile';
import TokenBig from './TokenBig';
import { getStatusBarHeight } from './lib/util/util'
import useWindowSize from './useWindowSize'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    height: '100%',
    overflowX: 'hidden',
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: getStatusBarHeight(),
  },
}));
const rStyle = {
  label: {
    width: 150,
    height: 150,
    lineHeight: '150px',
    fontSize: '150%',
  },
  loading: {
    position: 'absolute',
    top: 3,
    left: 2,
    size: 155,
  },
  buttom: {
    position: 'absolute',
    top: 3,
    left: 2,
    size: 155,
  }
}
console.log(111)
export default function Staff() {
  const { user, cache, showDialog } = useContext(YingContext)
  const classes = useStyles()
  const [data, setData] = useState()
  const windowSize=useWindowSize()
  useDeepEffect(() => {
    console.log(user)
    if (user && user.intents && user.intents.shengyin && user.intents.shengyin.data) {
      setData(user.intents.shengyin.data);
    }
  }, [user])
  const handleClick = (meta, id) => () => {
    const src = meta.profile?.manner?.avatar || meta.image
    const title = meta.profile?.name || meta.title
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
              avatar: src,
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
  function DataReady(meta) {
    const { audio: d } = meta
    const ready = !!(d ? d.length < 150 ? cache[d] : d : null)
    return ready
  }
  function SubTitle(meta) {
    const { audio: id } = meta
    const { torrents = {} } = cache
    const { progress = 0 } = torrents[id] || {}
    if (progress > 0 && progress < 1) {
      return Math.floor(progress * 100) + '%'
    }
  }
  const heightFull = useMemo(() => {
    const size = Object.values(data?.metas || {}).length
    const { height: h, width: w } = windowSize
    const n = Math.floor(w / 150)
    const m = Math.floor(size / n)
    const hh = m * 150
    return hh > h
  }, [data,windowSize]);
  return (
    <div style={{ margin: 'auto' }}>
      {data && <Grid container className={classes.root} style={{alignContent:heightFull?'stretch':'center'}}>
        {Object.entries(data.metas || {}).map(([id, meta]) => (
          <Grid key={id} item>
            <Play meta={meta} volume={data.volume} />
            <TokenBig
              loading={!DataReady(meta)}
              subTitle={SubTitle(meta)}
              token={meta}
              onClick={handleClick(meta, id, data.edit)}
              style={rStyle} />
          </Grid>
        ))}
      </Grid>
      }
      <Add />
      <Refresh />
      <Profile />
    </div>
  )
}