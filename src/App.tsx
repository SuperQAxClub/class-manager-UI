import { Route, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { HomePage } from './page/Home'
import { LoginPage } from './page/Login'
import { CoursePage } from './page/Course'
import { ProfilePage } from './page/Profile'

function App() {

  return (
    <Router base='/' hook={useHashLocation}>
      <Route path={"/"} component={HomePage} />
      <Route path={"/course"} component={CoursePage} />
      <Route path={"/profile"} component={ProfilePage} />
      <Route path={"/login"} component={LoginPage} />
    </Router>
  )
}

export default App
