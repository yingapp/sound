import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import React, { useContext } from 'react';
import { YingContext,getFab } from './lib/react-ying/index';

console.log(111)
const useStyles = makeStyles((theme) => ({
     button: {
          position: 'fixed',
          bottom: theme.spacing(3),
          right: theme.spacing(13),
          ...getFab(theme)
     },
}));

export default function Refresh() {
     const classes = useStyles();
     const { sendMsg } = useContext(YingContext);
     const refresh = () => {
          sendMsg({ refresh: true })
   }
     return <IconButton className={classes.button} onClick={refresh}>
          <RefreshIcon />
     </IconButton>
}