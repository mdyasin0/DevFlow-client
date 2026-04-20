
import { Outlet } from 'react-router'
import './App.css'
import Footer from './components/Footer'
import Home from './components/Home'
import Navbar from './components/Navbar'

function App() {


  return (
    <>
<Navbar/>
<Outlet/>

<Footer/>
    </>
  )
}

export default App
