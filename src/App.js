import React, {useEffect,useState} from 'react'
import './App.css'
import Main from "./components/Main.jsx"
import data from "./util/data.json";
import {keepTheme} from "./util/themeMode"

const App = () => {

  const invoicesData = JSON.parse(localStorage.getItem("invoices")) || []
  const [invoices,setInvoices] = useState(invoicesData)

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  },[invoices])

  useEffect(() => {
    if(localStorage.getItem('invoices') === "[]"){
      localStorage.setItem('invoices', JSON.stringify(data))
    }
    if(!localStorage.getItem('invoices')){
      localStorage.setItem('invoices', JSON.stringify(data))
    }
    setInvoices(JSON.parse(localStorage.getItem('invoices')))
  },[])

  useEffect(() => {
    keepTheme()
  })

  return (
    <div>
      <Main invoices={invoices} setInvoices={setInvoices}/>
    </div>
  )
}

export default App
