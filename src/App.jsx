import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [data, setData] = useState(null);


  useEffect( () => {
    fetch('http://localhost:8080/hello/cheese')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error))
  })

  return (
    <>
      <div>
          {data ? <pre>{JSON.stringify(data,null, 2)} </pre> : "Loading..." }

          
      </div>
    </>
  )
}

export default App
