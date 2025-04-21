import { useState } from 'react'
import { Route, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { HomePage } from './page/Home'

function App() {

  return (
    <Router base='/' hook={useHashLocation}>
      <Route path={"/"} component={HomePage} />
    </Router>
  )
}

export default App
