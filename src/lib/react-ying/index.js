import jsonmergepatch from 'json-merge-patch';
import React, { useState, useCallback } from "react";
import { isPC } from '../util/util';
console.log(111)
const intentId = 'shengyin'
/**
 * 和父窗口交互
 */
const fns = {}
const config = {
     ui: /Ying_\w+/.test(navigator.userAgent) ? 'app' : 'web',
     mode: navigator.userAgent === 'Ying_app' ? 'app' : 'web',
};
let fid = 0;
const cbs = new Set();
if (config.mode === 'web') {
     window.addEventListener('message', onReceivedPostMessage, false);
} else {
     window.callJS = callJS.bind(this)
}
function notify(msg) {
     cbs.forEach(cb => cb(msg));
}
function send(msg, fn) {
     if (typeof fn === 'function') {
          const id = 'fid' + fid++
          fns[id] = fn;
          msg.fid = id;
     }
     //debug
     if (config.mode === 'web') {
          window.parent.postMessage(msg, '*');
          //window.parent.postMessage(msg, 'https://yingapp.herokuapp.com');
     } else {
          prompt(JSON.stringify(msg))
     }
}
function onReceivedPostMessage(event) {
     const msg = event.data;
     performAction(msg);
}
function callJS(json) {
     const msg = JSON.parse(json);
     performAction(msg);
}
function performAction(msg) {
     const { fid } = msg;
     if (fid) {
          const fn = fns[fid];
          if (fn) {
               delete msg.fid;
               fn(msg.dataURI ? msg.dataURI : msg);
               // delete fns[fid];//为了再次接收回调
          }
     } else {
          notify(msg);
     }
}
window.YING = { send, cbs }
/**
 * 主题
 */
const defaultThemes = {
     light: {
          bar: {
               backgroundColor: 'transparent',
          },
          paper: {
               backgroundColor: '#ffffff',
          },
          button: {
               backgroundColor: '#f1f3f5',
               focus: {
                    backgroundColor: '#e1e3e5',
               }
          },
          input: {
               backgroundColor: '#eaebec',
               focus: {
                    backgroundColor: '#d1d3d5',
               }
          },
          bubble: {
               color: 'white',
               backgroundColor: '#000095'
          },
          avatar: {
               color: '#000095',
               backgroundColor: 'green',
               focus: {
                    color: 'white',
                    backgroundColor: '#000095',
               }
          },
          token: {
               color: '#000095',
               backgroundColor: 'transparent',
          },
          fab: {
               color: '#000095',
               backgroundColor: 'white',
               focus: {
                    color: 'white',
                    backgroundColor: '#000095',
               }
          },
     },
     dark: {
          bar: {
               backgroundColor: 'transparent',
          },
          paper: {
               backgroundColor: '#1f1f1f',
          },
          backgroundColor: {
               backgroundColor: '#1f1f1f',
          },
          button: {
               backgroundColor: '#282c2f',
               focus: {
                    backgroundColor: '#3c4043',
               }
          },
          input: {
               backgroundColor: '#1a1a1a',
               focus: {
                    backgroundColor: '#101010',
               }
          },
          bubble: {
               color: 'white',
               backgroundColor: '#000095'
          },
          avatar: {
               color: 'white',
               backgroundColor: 'green',
               focus: {
                    color: 'white',
                    backgroundColor: '#101010',
               }
          },
          token: {
               color: 'white',
               backgroundColor: 'transparent',
          },
          fab: {
               color: 'lightgray',
               backgroundColor: '#1f1f1f',
               focus: {
                    color: 'white',
                    backgroundColor: 'darkgreen',
               }
          },
     },
}
let themes = JSON.parse(JSON.stringify(defaultThemes))
const padding = isPC() ? '0.35em 1em' : '0.5em 1em'
export function getInput(theme) {
     const palette = themes[theme.palette.type].input
     return {
          borderRadius: 50,
          padding,
          color: palette?.color,
          backgroundColor: palette?.backgroundColor,
          transition: theme.transitions.create(['background-color', 'color', 'box-shadow']),
          boxShadow: `0 0 0 0.1rem transparent`,
          '&:hover': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
               boxShadow: `0 0 0 0.1rem ${palette?.focus?.borderColor}`,
          },
          '&:focus': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
               boxShadow: `0 0 0 0.1rem ${palette?.focus?.borderColor}`,
          }
     }
}
export function getAvatar(theme) {
     const palette = themes[theme.palette.type].avatar
     return {
          color: palette?.color,
          backgroundColor: palette?.backgroundColor,
          transition: theme.transitions.create(['background-color', 'color']),
          '&:hover': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
          },
          '&:focus': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
          }
     }
}
export function getFab(theme) {
     const palette = themes[theme.palette.type].fab
     return {
          color: palette?.color,
          backgroundColor: palette?.backgroundColor,
          transition: theme.transitions.create(['background-color', 'color']),
          '&:hover': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
          },
          '&:focus': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
          }
     }
}
export function getToken(theme) {
     const palette = themes[theme.palette.type].token
     return {
          color: palette?.color,
          backgroundColor: palette?.backgroundColor,
          transition: theme.transitions.create(['background-color', 'color']),
          '&:hover': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
          },
          '&:focus': {
               color: palette?.focus?.color,
               backgroundColor: palette?.focus?.backgroundColor,
          }
     }
}
export function getBar(theme) {
     return getPalette(theme).bar
}
export function getPaper(theme) {
     return getPalette(theme).paper
}
export function getPalette(theme) {
     return themes[theme.palette.type]
}

export function getThemes() {
     return themes
}
/**
 * 消息
 */
cbs.add(handleMsg);
let setThemeUpdaterCallback, setUserCallback //, setCacheCallBack
let hookCache
function handleMsg(msg) {
     if (msg.user) {
          const msgUserThemes = msg.user?.profile?.manner?.themes
          if (msgUserThemes) {
               jsonmergepatch.apply(themes, msgUserThemes)
          } else {
               themes = JSON.parse(JSON.stringify(defaultThemes))
          }
          handleThemeChange()
          if (setUserCallback) {
               setUserCallback(msg.user)
          }
     } else if (msg.torrent) {
          const { torrent } = msg
          const { torrents = {} } = hookCache
         torrents[torrent.id] = torrent
          hookCache.torrents = torrents
     }
}
function handleThemeChange() {
     if (typeof setThemeUpdaterCallback === 'function') {
          setThemeUpdaterCallback(JSON.stringify(themes))
     }
}
/**
 * React 组件
 */
export const YingContext = React.createContext([{}, () => { }]);
export const YingProvider = (props) => {
     const [user, setUser] = useState({})
     const [update, setUpdate] = useState()
     const [cache] = useState(new Proxy({}, {
          get: (target, id) => {
               if (id in target) {
                    return target[id]
               } else {
                    window.YING.send({ data: { id } }, r => {
                         if (r.data) {
                              target[id] = r.data
                              setUpdate(new Date().getTime())
                         }
                    })
                    return undefined
               }
          },
          set: (target, id, value) => {
               if (typeof id !== 'string') {
                    throw new TypeError('Id必须时字符串');
                    // return false
               }
               target[id] = value
               setUpdate(new Date().getTime())
               return true
          }
     }))
     hookCache = cache
     const showDialog = useCallback((chat, fn) => {
          const data = {
               id: intentId + 'Chat',
               intentId: 'chat',
               outer: {
                    open: true,
                    transition: 'slide',
               },
               inner: {
                    clear: true,
                    bot: {
                         uid: intentId + 'Bot',
                         profile: {
                              name: '策划',
                              manner: {
                                   color: 'pink,deeppink,hotpink,pink',
                                   bubble: 'Telegram',
                                   top: -3,
                                   zoom: 120,
                                   backgroundSize: 350,
                              }
                         }
                    },
                    option: {
                         title: 'untitled',
                         titleStyle: {
                              color: '#000095'
                         },
                         direction: 'left',
                    },
               },
          }
          sendMsg({ chat: jsonmergepatch.apply(data, chat) }, fn)
     }, [])
     const sendMsg = (msg, fn) => {
          window.YING.send(msg, fn)
     }
     const sendIntent = (msg, fn) => {
          sendMsg({ user: { intents: { [intentId]: msg } } })
     }
     const sendData = (msg, fn) => {
          sendMsg({ user: { intents: { [intentId]: { data: msg } } } })
     }
     const getData = () => {
          return user?.intents?.[intentId]?.data || {}
     }
     setUserCallback = setUser
     return (
          <YingContext.Provider value={{ user, cache, update, showDialog, sendMsg, sendData, getData, sendIntent }}>
               {props.children}
          </YingContext.Provider>
     );
}
export function useYing() {
     const [themeUpdater, setThemeUpdater] = useState()
     setThemeUpdaterCallback = setThemeUpdater
     return { themeUpdater }
}