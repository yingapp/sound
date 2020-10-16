import React from "react";
import { Switch, HashRouter as Router, Route } from "react-router-dom";
import Sound from './Sound';
import { YingProvider } from './lib/react-ying/index'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
console.log(111)
window.YING.send({
  app: {
    title: '声音',
    loading: false,
  }
});
export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // const { themeUpdater } = useYing()
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        }
      }),
    [prefersDarkMode],
  );


  return (
    <ThemeProvider theme={theme}>
      <YingProvider>
        <Router>
          <Switch>
            <Route component={Sound} />
          </Switch>
        </Router>
      </YingProvider>
    </ThemeProvider>

  );
}