import { Route, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { HomePage } from './page/Home'
import { LoginPage } from './page/Login'

function App() {

  return (
    <Router base='/' hook={useHashLocation}>
      <Route path={"/"} component={HomePage} />
      <Route path={"/login"} component={LoginPage} />
    </Router>
  )
}

export default App
