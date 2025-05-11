import { Route, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { HomePage } from './page/Home'
import { LoginPage } from './page/Login'
import { CoursePage } from './page/Course'
import { ProfilePage } from './page/Profile'
import { useEffect, useState } from 'react'
import { getSession } from './utils/utils'
import { ProfileType, requestProfile } from './api/auth'
import { useAccountStore } from './store/accountStore'
import { MyCoursePage } from './page/MyCourse'
import { AdminCourseManager } from './page/AdminCourseManager'

function App() {

  const {profile, setProfile} = useAccountStore();
  const [loading, setLoading] = useState(true);
  const getProfile = async() => {
    const session = getSession();
    if(session) {
      const profile = await requestProfile<ProfileType>(session.id);
      if(profile.items) {
        setProfile(profile.items)
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false)
    }
  }
  useEffect(() => {
    getProfile();
  }, [])
  useEffect(() => {
    if(profile) {
      setLoading(false);
    }
  }, [profile])

  return (
    <>
      {loading ? (
        <div className='page-loading'>
          <div className="loading-icon"></div>
        </div>
      ) : (
        <Router base='/' hook={useHashLocation}>
          <Route path={"/"} component={HomePage} />
          <Route path={"/course"} component={CoursePage} />
          <Route path={"/profile"} component={ProfilePage} />
          <Route path={"/my-course"} component={MyCoursePage} />
          <Route path={"/tung-siu-vip-pro"} component={AdminCourseManager} />
          <Route path={"/login"} component={LoginPage} />
        </Router>
      )}
    </>
  )
}

export default App
