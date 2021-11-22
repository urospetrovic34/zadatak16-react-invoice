import React, { useEffect, useState } from 'react'
import './Main.css'
import navbarLogo from '../cssAssets/logo.svg'
import sunLogo from '../cssAssets/icon-sun.svg'
import moonLogo from '../cssAssets/icon-moon.svg'
import plusLogo from '../cssAssets/icon-plus.svg'
import arrowDownLogo from '../cssAssets/icon-arrow-down.svg'
import arrowRightLogo from '../cssAssets/icon-arrow-right.svg'
import arrowLeftLogo from '../cssAssets/icon-arrow-left.svg'
import deleteLogo from '../cssAssets/icon-delete.svg'
import imageAvatar from '../cssAssets/image-avatar.jpg'
import noInvoiceIllustration from '../cssAssets/illustration-empty.svg'
import emptyObject from '../util/emptyObject.json'
import { setTheme } from '../util/themeMode'

const Main = ({ invoices, setInvoices }) => {

    const [allInvoicesCopy, setAllInvoicesCopy] = useState(invoices)
    const [hidden, setHidden] = useState("")
    const [hiddenFilterModal, setHiddenFilterModal] = useState("hidden")
    const [singleInvoice, setSingleInvoice] = useState(emptyObject)
    const [copySingleInvoice, setCopySingleInvoice] = useState(emptyObject)
    const [filteredArrow, setFilteredArrow] = useState("")
    const [createModalMoved, setCreateModalMoved] = useState("invoice-modal-create-moved")
    const [createModalWrapper, setCreateModalWrapper] = useState("")
    const [editModalMoved, setEditModalMoved] = useState("invoice-modal-edit-moved")
    const [editModalWrapper, setEditModalWrapper] = useState("")
    const [newInvoiceItems, setNewInvoiceItems] = useState([])
    const [newInvoiceNewItemId, setNewInvoiceNewItemId] = useState(1)
    //const [editInvoiceNewItemId, setEditInvoiceNewItemId] = useState(1)
    const [pendingChecked, setPendingChecked] = useState(false)
    const [draftChecked, setDraftChecked] = useState(false)
    const [paidChecked, setPaidChecked] = useState(false)
    const [toggleClass, setToggleClass] = useState("light")
    const [rotatedArrow,setRotatedArrow] = useState("select-arrow")
    const [visibleDeleteModalWrapper,setVisibleDeleteModalWrapper] = useState("delete-modal-wrapper-moved")
    const [invoiceToDelete,setInvoiceToDelete] = useState("")
    //const [markedInvoice,setMarkedInvoice] = useState("")
    let theme = localStorage.getItem("theme")
    let currDate = new Date()

    const [newInvoiceObject, setNewInvoiceObject] = useState({
        "createdAt": currDate.getFullYear() + "-" + currDate.toLocaleString('default', { month: '2-digit' }) + "-" + currDate.getDate(),
        "description": "",
        "paymentTerms": "1",
        "clientName": "",
        "clientEmail": "",
        "senderAddressStreet": "",
        "senderAddressCity": "",
        "senderAddressPostCode": "",
        "senderAddressCountry": "",
        "clientAddressStreet": "",
        "clientAddressCity": "",
        "clientAddressPostCode": "",
        "clientAddressCountry": ""
    })

    const handleSingleInvoice = (id) => {
        setHidden("hidden")
        invoices.filter((invoice) => {
            if (invoice.id === id) {
                let newObject = invoice
                newObject.items.forEach((item, index) => { item.id = index + 1 })
                setSingleInvoice(JSON.parse(JSON.stringify(newObject)))
                setCopySingleInvoice(newObject)
            }
            return null
        })
    }

    const handleMainMenu = () => {
        setHidden("")
        setSingleInvoice(emptyObject)
        setCopySingleInvoice(emptyObject)
    }

    const handleFilterModal = () => {
        if (hiddenFilterModal === "hidden") {
            setHiddenFilterModal("")
            setFilteredArrow("reversed-arrow")
        }
        else if (hiddenFilterModal === "") {
            setHiddenFilterModal("hidden")
            setFilteredArrow("")
        }
    }

    const handleAddItemsNewInvoice = () => {
        setNewInvoiceItems([...newInvoiceItems, { "id": newInvoiceNewItemId, "name": "", "quantity": 0, "price": 0, "total": 0 }])
        setNewInvoiceNewItemId(newInvoiceNewItemId + 1)
    }

    const handleAddItemsEditInvoice = () => {
        setCopySingleInvoice({ ...copySingleInvoice, items: [...copySingleInvoice.items, { "id": copySingleInvoice.items.length + 1, "name": "", "quantity": 0, "price": 0, "total": 0 }] })
    }

    const handleCreateModalMove = () => {
        if (createModalMoved === "invoice-modal-create-moved") {
            setCreateModalMoved("invoice-modal-create")
            setCreateModalWrapper("invoice-modal-create-wrapper")
        }
        else if (createModalMoved === "invoice-modal-create") {
            setCreateModalMoved("invoice-modal-create-moved")
            setCreateModalWrapper("")
        }
    }

    const handleDeleteInvoiceItem = (id) => {
        setInvoices(invoices.filter((item) => item.id !== id))
        window.location.reload();
    }

    const handleNewInvoiceNewItemNameUpdate = (e, id) => {
        let newArray = [...newInvoiceItems]
        newArray[newInvoiceItems.findIndex(item => item.id === id)].name = e.target.value
        setNewInvoiceItems(newArray)
    }

    const handleNewInvoiceNewItemQuantityUpdate = (e, id) => {
        let newArray = [...newInvoiceItems]
        console.log(newArray)
        newArray[newInvoiceItems.findIndex(item => item.id === id)].quantity = parseInt(e.target.value)
        newArray[newInvoiceItems.findIndex(item => item.id === id)].total = newArray[newInvoiceItems.findIndex(item => item.id === id)].price * newArray[newInvoiceItems.findIndex(item => item.id === id)].quantity
        setNewInvoiceItems(newArray)
    }

    const handleNewInvoiceNewItemPriceUpdate = (e, id) => {
        let newArray = [...newInvoiceItems]
        console.log(newArray)
        newArray[newInvoiceItems.findIndex(item => item.id === id)].price = parseFloat(e.target.value)
        newArray[newInvoiceItems.findIndex(item => item.id === id)].total = newArray[newInvoiceItems.findIndex(item => item.id === id)].price * newArray[newInvoiceItems.findIndex(item => item.id === id)].quantity
        setNewInvoiceItems(newArray)
    }

    const handleEditInvoiceNewItemNameUpdate = (e, id) => {
        let newArray = [...copySingleInvoice.items]
        newArray[(newArray.findIndex(item => item.id === id))].name = e.target.value
        setCopySingleInvoice({ ...copySingleInvoice, items: newArray })
    }

    const handleEditInvoiceNewItemQuantityUpdate = (e, id) => {
        let newArray = [...copySingleInvoice.items]
        newArray[(newArray.findIndex(item => item.id === id))].quantity = parseFloat(e.target.value)
        newArray[(newArray.findIndex(item => item.id === id))].total = newArray[(newArray.findIndex(item => item.id === id))].price * newArray[(newArray.findIndex(item => item.id === id))].quantity
        setCopySingleInvoice({ ...copySingleInvoice, items: newArray })
    }

    const handleEditInvoiceNewItemPriceUpdate = (e, id) => {
        let newArray = [...copySingleInvoice.items]
        newArray[(newArray.findIndex(item => item.id === id))].price = parseFloat(e.target.value)
        newArray[(newArray.findIndex(item => item.id === id))].total = newArray[(newArray.findIndex(item => item.id === id))].price * newArray[(newArray.findIndex(item => item.id === id))].quantity
        setCopySingleInvoice({ ...copySingleInvoice, items: newArray })
    }

    const handleNewInvoiceNewItemDelete = (id) => {
        setNewInvoiceItems(newInvoiceItems.filter((item) => item.id !== id))
    }

    const handleEditInvoiceNewItemDelete = (id) => {
        setCopySingleInvoice({ ...copySingleInvoice, items: [...copySingleInvoice.items.filter((item) => item.id !== id)] })
    }

    const handleEditModalSaveChanges = (e) => {
        let notEmptyValObject = Object.values(copySingleInvoice).every(el => el !== '')
        let notEmptyItems = copySingleInvoice.items.map((item) => (
            Object.values(item).some(el => el === 0 || el === "")
        ))
        let notEmptyItemCombined = notEmptyItems.every(el => !el)
        let totalTotal = 0
        copySingleInvoice.items.map((item) => (
            totalTotal += item.total
        ))
        //let newInvoiceItemsNoId = copySingleInvoice.items.map(({ id, ...rest }) => rest)
        if (copySingleInvoice.items.length > 0 && notEmptyValObject && notEmptyItemCombined) {
            alert("MOZEMO IZMENITI RACUN")
        }
        else {

        }
    }

    const handleDeleteModal = (id) => {
        if(visibleDeleteModalWrapper === "delete-modal-wrapper-moved"){
            setVisibleDeleteModalWrapper("delete-modal-wrapper")
            setInvoiceToDelete(id)
        }
        else{
            setVisibleDeleteModalWrapper("delete-modal-wrapper-moved")
            setInvoiceToDelete("")
        }
    }

    const handleToggleLightDarkMode = () => {
        if (localStorage.getItem("theme") === "theme-dark") {
            setTheme("theme-light")
            setToggleClass("light")
        }
        else {
            setTheme("theme-dark")
            setToggleClass("dark")
        }
    }

    const handleFormPreventDefault = (e) => {
        e.preventDefault()
    }

    const generateId = () => {
        let letterPart = ""
        let numberPart = ""
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        let numbers = "0123456789"
        for (let i = 0; i < 2; i++) {
            letterPart += characters.charAt(Math.floor(Math.random() * (characters.length)))
        }
        for (let i = 0; i < 4; i++) {
            numberPart += numbers.charAt(Math.floor(Math.random() * (numbers.length)))
        }
        let combinedId = letterPart + numberPart
        return combinedId
    }

    const handleNewInvoiceDraft = (e) => {
        let randomId = generateId()
        let totalTotal = 0
        newInvoiceItems.map((item) => (
            totalTotal += item.total
        ))
        let newInvoiceItemsNoId = newInvoiceItems.map(({ id, ...rest }) => rest)
        alert("MOZEMO NAPRAVITI NOVI RACUN")
        let createdAtDate = new Date(newInvoiceObject.createdAt)
        let paymentDueDate = new Date(createdAtDate.getTime() + (parseInt(newInvoiceObject.paymentTerms) * 24 * 60 * 60 * 1000))
        let newSavedInvoice = {
            "id": randomId,
            "createdAt": createdAtDate.getFullYear() + "-" + createdAtDate.toLocaleString('default', { month: '2-digit' }) + "-" + createdAtDate.getDate(),
            "paymentDue": paymentDueDate.getFullYear() + "-" + paymentDueDate.toLocaleString('default', { month: '2-digit' }) + "-" + paymentDueDate.getDate(),
            "description": newInvoiceObject.description,
            "paymentTerms": parseInt(newInvoiceObject.paymentTerms),
            "clientName": newInvoiceObject.clientName,
            "clientEmail": newInvoiceObject.clientEmail,
            "status": "draft",
            "senderAddress": {
                "street": newInvoiceObject.senderAddressStreet,
                "city": newInvoiceObject.senderAddressCity,
                "postCode": newInvoiceObject.senderAddressPostCode,
                "country": newInvoiceObject.senderAddressCountry
            },
            "clientAddress": {
                "street": newInvoiceObject.clientAddressStreet,
                "city": newInvoiceObject.clientAddressCity,
                "postCode": newInvoiceObject.clientAddressPostCode,
                "country": newInvoiceObject.clientAddressCountry
            },
            "items": newInvoiceItemsNoId,
            "total": totalTotal
        }
        setInvoices([...invoices, newSavedInvoice])
        setTimeout(() => { handleCreateModalMove() }, 5000)
    }

    const handleNewInvoiceCreation = (e) => {
        let randomId = generateId()
        let notEmptyValObject = Object.values(newInvoiceObject).every(el => el !== '')
        let notEmptyItems = newInvoiceItems.map((item) => (
            Object.values(item).some(el => el === 0 || el === "")
        ))
        let notEmptyItemCombined = notEmptyItems.every(el => !el)
        let totalTotal = 0
        newInvoiceItems.map((item) => (
            totalTotal += item.total
        ))
        let newInvoiceItemsNoId = newInvoiceItems.map(({ id, ...rest }) => rest)
        if (newInvoiceItems.length > 0 && notEmptyValObject && notEmptyItemCombined) {
            alert("MOZEMO NAPRAVITI NOVI RACUN")
            let createdAtDate = new Date(newInvoiceObject.createdAt)
            let paymentDueDate = new Date(createdAtDate.getTime() + (parseInt(newInvoiceObject.paymentTerms) * 24 * 60 * 60 * 1000))
            let newSavedInvoice = {
                "id": randomId,
                "createdAt": createdAtDate.getFullYear() + "-" + createdAtDate.toLocaleString('default', { month: '2-digit' }) + "-" + createdAtDate.getDate(),
                "paymentDue": paymentDueDate.getFullYear() + "-" + paymentDueDate.toLocaleString('default', { month: '2-digit' }) + "-" + paymentDueDate.getDate(),
                "description": newInvoiceObject.description,
                "paymentTerms": parseInt(newInvoiceObject.paymentTerms),
                "clientName": newInvoiceObject.clientName,
                "clientEmail": newInvoiceObject.clientEmail,
                "status": "pending",
                "senderAddress": {
                    "street": newInvoiceObject.senderAddressStreet,
                    "city": newInvoiceObject.senderAddressCity,
                    "postCode": newInvoiceObject.senderAddressPostCode,
                    "country": newInvoiceObject.senderAddressCountry
                },
                "clientAddress": {
                    "street": newInvoiceObject.clientAddressStreet,
                    "city": newInvoiceObject.clientAddressCity,
                    "postCode": newInvoiceObject.clientAddressPostCode,
                    "country": newInvoiceObject.clientAddressCountry
                },
                "items": newInvoiceItemsNoId,
                "total": totalTotal
            }
            setInvoices([...invoices, newSavedInvoice])
            setTimeout(() => { handleCreateModalMove() }, 5000)
        }
        else {
            alert(randomId)
        }
    }

    const handleArrowDown = (e) => {
        if(rotatedArrow==="select-arrow"){
            setRotatedArrow("select-arrow-rotated")
        }
        else{
            setRotatedArrow("select-arrow")
        }
    }

    const handleNewInvoiceObjectDataChange = (e) => {
        setNewInvoiceObject({ ...newInvoiceObject, [e.target.name]: e.target.value })
    }

    const handleEditInvoiceObjectDataChange = (e) => {
        setCopySingleInvoice({ ...copySingleInvoice, [e.target.name]: e.target.value })
    }

    const handleEditInvoiceObjectNestedDataSenderChange = (e) => {
        setCopySingleInvoice({ ...copySingleInvoice, senderAddress: { ...copySingleInvoice.senderAddress, [e.target.name]: e.target.value } })
    }

    const handleEditInvoiceObjectNestedDataClientChange = (e) => {
        setCopySingleInvoice({ ...copySingleInvoice, clientAddress: { ...copySingleInvoice.clientAddress, [e.target.name]: e.target.value } })
    }

    const handleEditModalMove = () => {
        if (editModalMoved === "invoice-modal-edit-moved") {
            setEditModalMoved("invoice-modal-edit")
            setEditModalWrapper("invoice-modal-edit-wrapper")
        }
        else if (editModalMoved === "invoice-modal-edit") {
            setEditModalMoved("invoice-modal-edit-moved")
            setEditModalWrapper("")
            setCopySingleInvoice(singleInvoice)
        }
    }

    const handleMarkPaid = (id) => {
        let newArray = [...invoices]
        newArray[newArray.findIndex(item => item.id === id)].status = "paid"
        setSingleInvoice(singleInvoice => ({...singleInvoice, status:"paid"}))
        setInvoices(newArray)
    }

    useEffect(() => {
        if (localStorage.getItem("theme") === "theme-dark") {
            setToggleClass("dark")
        }
        else if (localStorage.getItem("theme") === "theme-light") {
            setToggleClass("light")
        }
    }, [theme])

    useEffect(() => {
        if (pendingChecked && !draftChecked && !paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "pending"))
        }
        else if (!pendingChecked && draftChecked && !paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "draft"))
        }
        else if (!pendingChecked && !draftChecked && paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "paid"))
        }
        else if (pendingChecked && draftChecked && !paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "pending" || invoice.status === "draft"))
        }
        else if (!pendingChecked && draftChecked && paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "draft" || invoice.status === "paid"))
        }
        else if (pendingChecked && !draftChecked && paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "pending" || invoice.status === "paid"))
        }
        else if (pendingChecked && draftChecked && paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "pending" || invoice.status === "paid" || invoice.status === "draft"))
        }
        else if (!pendingChecked && !draftChecked && !paidChecked) {
            setAllInvoicesCopy(invoices.filter(invoice => invoice.status === "pending" || invoice.status === "paid" || invoice.status === "draft"))
        }
    }, [paidChecked, draftChecked, pendingChecked, invoices])

    return (
        <div className="wrapper">
            <div className={`${visibleDeleteModalWrapper}`}>
                <div className="delete-modal">
                    <div className="delete-modal-title">
                        <p>Confirm Deletion</p>
                    </div>
                    <div className="delete-modal-paragraph">
                        <p>Are you sure you want to delete invoice {invoiceToDelete}? This action cannot be undone.</p>
                    </div>
                    <div className="delete-modal-buttons">
                        <div className="delete-modal-cancel-button">
                            <button onClick={()=>handleDeleteModal()}>Cancel</button>
                        </div>
                        <div className="delete-modal-delete-button">
                            <button onClick={()=>handleDeleteInvoiceItem(invoiceToDelete)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="horizontal-navbar">
                <div className="hor-navbar-first-half">
                    <div className="hor-branding-container">
                        <img src={navbarLogo} alt="company-branding" />
                    </div>
                </div>
                <div className="hor-navbar-second-half">
                    <div className="hor-light-dark-mode-container">
                        {
                            toggleClass === "light" ?
                                <img src={moonLogo} alt="light-mode" onClick={() => handleToggleLightDarkMode()} />
                                :
                                <img src={sunLogo} alt="dark-mode" onClick={() => handleToggleLightDarkMode()} />
                        }
                    </div>
                    <div className="hor-user-image-container">
                        <img src={imageAvatar} alt="user" />
                    </div>
                </div>
            </div>
            <div className="vertical-navbar">
                <div className="navbar-first-half">
                    <div className="branding-container">
                        <img src={navbarLogo} alt="company-branding" />
                    </div>
                </div>
                <div className="navbar-second-half">
                    <div className="light-dark-mode-container">
                        {
                            toggleClass === "light" ?
                                <img src={moonLogo} alt="light-mode" onClick={() => handleToggleLightDarkMode()} />
                                :
                                <img src={sunLogo} alt="dark-mode" onClick={() => handleToggleLightDarkMode()} />
                        }
                    </div>
                    <div className="user-image-container">
                        <img src={imageAvatar} alt="user" />
                    </div>
                </div>
            </div>
            <div className="main">
                <div className={`${editModalWrapper}`}>
                    <form onSubmit={(e) => handleFormPreventDefault(e)}>
                        <div className={`${editModalMoved}`}>
                            <p className="edit-invoice-header">Edit <span>#</span>{copySingleInvoice.id}</p>
                            <div className="edit-invoice-main">
                                <div className="edit-invoice-bill-from">
                                    <p className="edit-invoice-bill-from-header">Bill From</p>
                                    <label htmlFor="edit-invoice-street-address">Street Address</label>
                                    <input type="text" id="edit-invoice-street-address" name="street" className="edit-invoice-bill-from-street-address" value={copySingleInvoice.senderAddress.street} onChange={(e) => handleEditInvoiceObjectNestedDataSenderChange(e)} />
                                    <div className="edit-invoice-bill-from-second-row">
                                        <div>
                                            <label htmlFor="edit-invoice-city">City</label>
                                            <input type="text" id="edit-invoice-city" name="city" className="edit-invoice-bill-from-city" value={copySingleInvoice.senderAddress.city} onChange={(e) => handleEditInvoiceObjectNestedDataSenderChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="edit-invoice-post-code">Post Code</label>
                                            <input type="text" id="edit-invoice-post-code" name="postCode" className="edit-invoice-bill-from-post-code" value={copySingleInvoice.senderAddress.postCode} onChange={(e) => handleEditInvoiceObjectNestedDataSenderChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="edit-invoice-country">Country</label>
                                            <input type="text" id="edit-invoice-country" name="country" className="edit-invoice-bill-from-country" value={copySingleInvoice.senderAddress.country} onChange={(e) => handleEditInvoiceObjectNestedDataSenderChange(e)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="edit-invoice-bill-to">
                                    <p className="edit-invoice-bill-to-header">Bill To</p>
                                    <label htmlFor="edit-invoice-client-name">Client’s Name</label>
                                    <input type="text" id="edit-invoice-client-name" name="clientName" className="edit-invoice-bill-to-client-name" value={copySingleInvoice.clientName} onChange={(e) => handleEditInvoiceObjectDataChange(e)} />
                                    <label htmlFor="edit-invoice-client-email">Client’s Email</label>
                                    <input type="email" id="edit-invoice-client-email" name="clientEmail" className="edit-invoice-bill-to-client-email" value={copySingleInvoice.clientEmail} onChange={(e) => handleEditInvoiceObjectDataChange(e)} />
                                    <label htmlFor="edit-invoice-client-street-address">Street Address</label>
                                    <input type="text" id="edit-invoice-client-street-address" name="street" className="edit-invoice-bill-to-client-street-address" value={copySingleInvoice.clientAddress.street} onChange={(e) => handleEditInvoiceObjectNestedDataClientChange(e)} />
                                    <div className="edit-invoice-bill-to-fourth-row">
                                        <div>
                                            <label htmlFor="edit-invoice-client-city">City</label>
                                            <input type="text" id="edit-invoice-client-city" name="city" className="edit-invoice-bill-to-client-city" value={copySingleInvoice.clientAddress.city} onChange={(e) => handleEditInvoiceObjectNestedDataClientChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="edit-invoice-client-post-code">Post Code</label>
                                            <input type="text" id="edit-invoice-client-post-code" name="postCode" className="edit-invoice-bill-to-client-post-code" value={copySingleInvoice.clientAddress.postCode} onChange={(e) => handleEditInvoiceObjectNestedDataClientChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="edit-invoice-client-country">Country</label>
                                            <input type="text" id="edit-invoice-client-country" name="country" className="edit-invoice-bill-to-client-country" value={copySingleInvoice.clientAddress.country} onChange={(e) => handleEditInvoiceObjectNestedDataClientChange(e)} />
                                        </div>
                                    </div>
                                    <div className="edit-invoice-bill-to-fifth-row">
                                        <div>
                                            <label htmlFor="createdAt">Invoice Date</label>
                                            <input type="date" id="edit-invoice-created-at" name="createdAt" className="edit-invoice-bill-to-created-at" value={copySingleInvoice.createdAt} onChange={(e) => handleEditInvoiceObjectDataChange(e)} />
                                        </div>
                                        <div className="edit-invoice-bill-to-payment-due-container">
                                            <label htmlFor="paymentTerms">Payment Terms</label>
                                            <select id="edit-invoice-payment-due" name="paymentTerms" className="edit-invoice-bill-to-payment-due" onClick={(e) => handleArrowDown(e)} onBlur={(e) => handleArrowDown(e)} onChange={(e) => handleEditInvoiceObjectDataChange(e)}>
                                                <option value="1">Net 1 day</option>
                                                <option value="7">Net 7 days</option>
                                                <option value="14">Net 14 days</option>
                                                <option value="30">Net 30 days</option>
                                            </select>
                                            <img src={arrowDownLogo} alt="select-arrow" className={rotatedArrow}/>
                                        </div>
                                    </div>
                                    <label htmlFor="description">Project Description</label>
                                    <input type="text" id="edit-invoice-description" name="description" className="edit-invoice-bill-to-description" value={copySingleInvoice.description} onChange={(e) => handleEditInvoiceObjectDataChange(e)} />
                                </div>
                                <div className="edit-invoice-item-list">
                                    <p className="edit-invoice-item-list-title">Item List</p>
                                    <div className="edit-invoice-item-list-heading">
                                        <div className="edit-invoice-item-list-name">Item Name</div>
                                        <div className="edit-invoice-item-list-quantity">Qty.</div>
                                        <div className="edit-invoice-item-list-price">Price</div>
                                        <div className="edit-invoice-item-list-total">Total</div>
                                    </div>
                                    {
                                        copySingleInvoice.items.length > 0 ? (
                                            copySingleInvoice.items.map(({ id, name, quantity, price, total }) => (
                                                <div className="edit-invoice-item-list-item-row" key={id}>
                                                    <input type="text" id={id} name={id + name} className="edit-invoice-item-list-item-row-name" value={name} onChange={(e) => handleEditInvoiceNewItemNameUpdate(e, id)} />
                                                    <input type="number" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" id={id} name={id + name} className="edit-invoice-item-list-item-row-quantity" max={500} value={quantity} onChange={(e) => handleEditInvoiceNewItemQuantityUpdate(e, id)} />
                                                    <input type="number" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" id={id} name={id + name} className="edit-invoice-item-list-item-row-price" value={price} onChange={(e) => handleEditInvoiceNewItemPriceUpdate(e, id)} />
                                                    <p className="edit-invoice-item-list-item-row-total">{total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                    <img src={deleteLogo} alt="delete-item" className="edit-invoice-item-list-item-row-delete" onClick={() => handleEditInvoiceNewItemDelete(id)} />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="edit-invoice-item-list-no-items">No items</div>
                                        )
                                    }
                                    <button className="edit-invoice-item-list-add-item-button" onClick={() => handleAddItemsEditInvoice()} >
                                        <img src={plusLogo} alt="add-item" />
                                        Add New Item
                                    </button>
                                </div>
                            </div>
                            <div className="edit-invoice-buttons">
                                <div>
                                    <button className="edit-invoice-discard-button" onClick={() => handleEditModalMove()}>Cancel</button>
                                </div>
                                <div>
                                    <button className="edit-invoice-save-button" onClick={(e) => handleEditModalSaveChanges(e)}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={`${createModalWrapper}`}>
                    <form onSubmit={(e) => handleFormPreventDefault(e)}>
                        <div className={`${createModalMoved}`}>
                            <p className="new-invoice-header">New Invoice</p>
                            <div className="new-invoice-main">
                                <div className="new-invoice-bill-from">
                                    <p className="new-invoice-bill-from-header">Bill From</p>
                                    <label htmlFor="senderAddressStreet">Street Address</label>
                                    <input type="text" id="new-invoice-street-address" name="senderAddressStreet" className="new-invoice-bill-from-street-address" value={newInvoiceObject.senderAddressStreet} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                    <div className="new-invoice-bill-from-second-row">
                                        <div>
                                            <label htmlFor="senderAddressCity">City</label>
                                            <input type="text" id="new-invoice-city" name="senderAddressCity" className="new-invoice-bill-from-city" value={newInvoiceObject.senderAddressCity} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="senderAddressPostCode">Post Code</label>
                                            <input type="text" id="new-invoice-post-code" name="senderAddressPostCode" className="new-invoice-bill-from-post-code" value={newInvoiceObject.senderAddressPostCode} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="senderAddressCountry">Country</label>
                                            <input type="text" id="new-invoice-country" name="senderAddressCountry" className="new-invoice-bill-from-country" value={newInvoiceObject.senderAddressCountry} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="new-invoice-bill-to">
                                    <p className="new-invoice-bill-to-header">Bill To</p>
                                    <label htmlFor="clientName">Client’s Name</label>
                                    <input type="text" id="new-invoice-client-name" name="clientName" className="new-invoice-bill-to-client-name" value={newInvoiceObject.clientName} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                    <label htmlFor="clientEmail">Client’s Email</label>
                                    <input type="email" id="new-invoice-client-email" name="clientEmail" className="new-invoice-bill-to-client-email" value={newInvoiceObject.clientEmail} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                    <label htmlFor="clientAddressStreet">Street Address</label>
                                    <input type="text" id="new-invoice-client-street-address" name="clientAddressStreet" className="new-invoice-bill-to-client-street-address" value={newInvoiceObject.clientAddressStreet} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                    <div className="new-invoice-bill-to-fourth-row">
                                        <div>
                                            <label htmlFor="clientAddressCity">City</label>
                                            <input type="text" id="new-invoice-client-city" name="clientAddressCity" className="new-invoice-bill-to-client-city" value={newInvoiceObject.clientAddressCity} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="clientAddressPostCode">Post Code</label>
                                            <input type="text" id="new-invoice-client-post-code" name="clientAddressPostCode" className="new-invoice-bill-to-client-post-code" value={newInvoiceObject.clientAddressPostCode} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                        </div>
                                        <div>
                                            <label htmlFor="clientAddressCountry">Country</label>
                                            <input type="text" id="new-invoice-client-country" name="clientAddressCountry" className="new-invoice-bill-to-client-country" value={newInvoiceObject.clientAddressCountry} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                        </div>
                                    </div>
                                    <div className="new-invoice-bill-to-fifth-row">
                                        <div>
                                            <label htmlFor="createdAt">Invoice Date</label>
                                            <input type="date" id="new-invoice-created-at" name="createdAt" className="new-invoice-bill-to-created-at" value={newInvoiceObject.createdAt} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                        </div>
                                        <div className="new-invoice-bill-to-payment-due-container">
                                            <label htmlFor="paymentTerms">Payment Terms</label>
                                            <select id="new-invoice-payment-due" name="paymentTerms" className="new-invoice-bill-to-payment-due" onClick={(e) => handleArrowDown(e)} onBlur={(e) => handleArrowDown(e)} onChange={(e) => handleNewInvoiceObjectDataChange(e)}>
                                                <option className="invoice-modal-option" value="1">Net 1 day</option>
                                                <option className="invoice-modal-option" value="7">Net 7 days</option>
                                                <option className="invoice-modal-option" value="14">Net 14 days</option>
                                                <option className="invoice-modal-option" value="30">Net 30 days</option>
                                            </select>
                                            <img src={arrowDownLogo} alt="select-arrow" className={rotatedArrow}/>
                                        </div>
                                    </div>
                                    <label htmlFor="description">Project Description</label>
                                    <input type="text" id="new-invoice-description" name="description" className="new-invoice-bill-to-description" value={newInvoiceObject.description} onChange={(e) => handleNewInvoiceObjectDataChange(e)} />
                                </div>
                                <div className="new-invoice-item-list">
                                    <p className="new-invoice-item-list-title">Item List</p>
                                    <div className="new-invoice-item-list-heading">
                                        <div className="new-invoice-item-list-name">Item Name</div>
                                        <div className="new-invoice-item-list-quantity">Qty.</div>
                                        <div className="new-invoice-item-list-price">Price</div>
                                        <div className="new-invoice-item-list-total">Total</div>
                                    </div>
                                    {
                                        newInvoiceItems.length > 0 ? (
                                            newInvoiceItems.map(({ id, name, quantity, price, total }) => (
                                                <div className="new-invoice-item-list-item-row" key={id}>
                                                    <input type="text" id={id} name="new-invoice-item-list-item-row-name" className="new-invoice-item-list-item-row-name" value={name} onChange={(e) => handleNewInvoiceNewItemNameUpdate(e, id)} />
                                                    <input type="number" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" id={id} name="new-invoice-item-list-item-row-quantity" className="new-invoice-item-list-item-row-quantity" value={quantity} onChange={(e) => handleNewInvoiceNewItemQuantityUpdate(e, id)} />
                                                    <input type="number" step="0.01" pattern="^\d+(?:\.\d{1,2})?$" id={id} name="new-invoice-item-list-item-row-price" className="new-invoice-item-list-item-row-price" value={price} onChange={(e) => handleNewInvoiceNewItemPriceUpdate(e, id)} />
                                                    <p className="new-invoice-item-list-item-row-total">{total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                    <img src={deleteLogo} alt="delete-item" className="new-invoice-item-list-item-row-delete" onClick={() => handleNewInvoiceNewItemDelete(id)} />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="new-invoice-item-list-no-items">No items</div>
                                        )
                                    }
                                    <button className="new-invoice-item-list-add-item-button" onClick={() => handleAddItemsNewInvoice()} >
                                        <img src={plusLogo} alt="add-item" />
                                        Add New Item
                                    </button>
                                </div>
                            </div>
                            <div className="new-invoice-buttons">
                                <div>
                                    <button className="new-invoice-discard-button" onClick={() => handleCreateModalMove()}>Discard</button>
                                </div>
                                <div className="new-invoice-right-buttons">
                                    <button className="new-invoice-draft-button" onClick={(e) => handleNewInvoiceDraft(e)}>Save as Draft</button>
                                    <button className="new-invoice-save-button" onClick={(e) => handleNewInvoiceCreation(e)}>Save & Send</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={`all-invoices-container ${hidden}`}>
                    <div className="all-invoices-limiter">
                        <div className="all-invoices-header">
                            <div className="all-invoices-header-first-half">
                                <p className="all-invoices-header-heading">Invoices</p>
                                <p className="all-invoices-header-total">There are total {allInvoicesCopy.length} invoices</p>
                            </div>
                            <div className="all-invoices-header-second-half">
                                <div className="all-invoices-header-filter-container">
                                    <button className="all-invoices-header-filter-button" onClick={() => handleFilterModal()}>
                                        <p className="all-invoices-header-filter">
                                        </p>
                                        <img src={arrowDownLogo} alt="filter" className={`${filteredArrow}`} />
                                    </button>
                                    <div className={`filter-modal ${hiddenFilterModal}`}>
                                        <div className="filter-modal-row">
                                            <input type="checkbox" id="draft" name="draft" value="Draft" onChange={(e) => setDraftChecked(e.target.checked)} />
                                            <label htmlFor="draft">Draft</label>
                                        </div>
                                        <div className="filter-modal-row">
                                            <input type="checkbox" id="pending" name="pending" value="Pending" onChange={(e) => setPendingChecked(e.target.checked)} />
                                            <label htmlFor="pending">Pending</label>
                                        </div>
                                        <div className="filter-modal-row">
                                            <input type="checkbox" id="paid" name="paid" value="Paid" onChange={(e) => setPaidChecked(e.target.checked)} />
                                            <label htmlFor="paid">Paid</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="all-invoices-header-new-invoice-button-container">
                                    <button className="all-invoices-header-new-invoice-button" onClick={() => handleCreateModalMove()}>
                                        <img src={plusLogo} alt="add-invoice" className="add-invoice-logo" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="all-invoices-data">
                            {
                                allInvoicesCopy.length === 0 ? (
                                    <div className="no-invoice-container">
                                        <img src={noInvoiceIllustration} alt="no-invoice" />
                                        <p className="no-invoice-header">There is nothing here</p>
                                        <p className="no-invoice-paragraph">  Create an invoice by clicking the
                                            <span> New Invoice</span> button and get started</p>
                                    </div>
                                ) : (
                                    <div className="invoices-container">
                                 {allInvoicesCopy.map(({ id, paymentDue, clientName, total, status }) => {
                                            let paymentDueDate = new Date(paymentDue)
                                            return (
                                                <div key={id} className="invoices-card" onClick={() => handleSingleInvoice(id)}>
                                                    <div className="invoice-id"><span>#</span>{id}</div>
                                                    <div className="invoice-due">Due {paymentDueDate.getDate() + " " + paymentDueDate.toLocaleString('default', { month: 'short' }) + " " + paymentDueDate.getFullYear()}</div>
                                                    <div className="invoice-client">{clientName}</div>
                                                    <div className="invoice-total">£ {total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                    <div className="invoice-status">{status === "pending" ? (<div className="pending-invoice">● {status}</div>) : status === "paid" ? (<div className="paid-invoice">● {status}</div>) : (<div className="draft-invoice">● {status}</div>)}</div>
                                                    <div className="invoice-arrow"><img src={arrowRightLogo} alt="invoice-arrow" /></div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="single-invoice-container">
                    <div className="single-invoice-limiter">
                        <div className="single-invoice-go-back" onClick={() => handleMainMenu()}>
                            <img src={arrowLeftLogo} alt="go-back-arrow" />
                            <p className="go-back-text">Go back</p>
                        </div>
                        <div className="single-invoice-buttons">
                            <div className="single-invoice-status">
                                <p className="single-invoice-status-text">Status</p>
                                <button className="single-invoice-status-button">{singleInvoice.status === "pending" ? (<div className="pending-invoice">● {singleInvoice.status}</div>) : singleInvoice.status === "paid" ? (<div className="paid-invoice">● {singleInvoice.status}</div>) : (<div className="draft-invoice">● {singleInvoice.status}</div>)}</button>
                            </div>
                            <div className="single-invoice-button-options">
                                <button className="single-invoice-edit-button" onClick={() => handleEditModalMove()}>Edit</button>
                                <button className="single-invoice-delete-button" onClick={() => handleDeleteModal(singleInvoice.id)}>Delete</button>
                                <button className="single-invoice-mark-button" onClick={() => handleMarkPaid(singleInvoice.id)}>Mark as Paid</button>
                            </div>
                        </div>
                        <div className="single-invoice-main">
                            <div className="single-invoice-main-first-row">
                                <div className="single-invoice-main-first-row-first-column">
                                    <p className="single-invoice-main-id"><span>#</span>{singleInvoice.id}</p>
                                    <p className="single-invoice-main-description">{singleInvoice.description}</p>
                                </div>
                                <div className="single-invoice-main-first-row-second-column">
                                    <p className="single-invoice-sender-street">{singleInvoice.senderAddress.street}</p>
                                    <p className="single-invoice-sender-city">{singleInvoice.senderAddress.city}</p>
                                    <p className="single-invoice-sender-post-code">{singleInvoice.senderAddress.postCode}</p>
                                    <p className="single-invoice-sender-country">{singleInvoice.senderAddress.country}</p>
                                </div>
                            </div>
                            <div className="single-invoice-main-second-row">
                                <div className="single-invoice-main-second-row-first-column">
                                    <div className="single-invoice-main-second-row-first-column-first-row">
                                        <p className="single-invoice-created-at-desc">Invoice Date</p>
                                        <p className="single-invoice-created-at">{singleInvoice.createdAt}</p>
                                    </div>
                                    <div className="single-invoice-main-second-row-first-column-second-row">
                                        <p className="single-invoice-payment-due-desc">Payment Due</p>
                                        <p className="single-invoice-payment-due">{singleInvoice.paymentDue}</p>
                                    </div>
                                </div>
                                <div className="single-invoice-main-second-row-second-column">
                                    <p className="single-invoice-client-desc">Bill To</p>
                                    <p className="single-invoice-client-name">{singleInvoice.clientName}</p>
                                    <p className="single-invoice-client-street">{singleInvoice.clientAddress.street}</p>
                                    <p className="single-invoice-client-city">{singleInvoice.clientAddress.city}</p>
                                    <p className="single-invoice-client-post-code">{singleInvoice.clientAddress.postCode}</p>
                                    <p className="single-invoice-client-country">{singleInvoice.clientAddress.country}</p>
                                </div>
                                <div className="single-invoice-main-second-row-third-column">
                                    <p className="single-invoice-client-mail-desc">Sent to</p>
                                    <p className="single-invoice-client-mail">{singleInvoice.clientEmail}</p>
                                </div>
                            </div>
                            <div className="single-invoice-main-items-container">
                                <div className="single-invoice-main-items-desc-row">
                                    <p className="single-invoice-main-items-item-name-desc">Item Name</p>
                                    <p className="single-invoice-main-items-item-quantity-desc">QTY.</p>
                                    <p className="single-invoice-main-items-item-price-desc">Price</p>
                                    <p className="single-invoice-main-items-item-total-desc">Total</p>
                                </div>
                                {
                                    singleInvoice.items.map((singleItem) => (
                                        <div className="single-invoice-main-items-item-row">
                                            <p className="single-invoice-main-items-item-name">{singleItem.name}</p>
                                            <p className="single-invoice-main-items-item-quantity">{singleItem.quantity}</p>
                                            <p className="single-invoice-main-items-item-price">£ {singleItem.price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                            <p className="single-invoice-main-items-item-total">£ {singleItem.total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        </div>
                                    ))
                                }
                                <div className="single-invoice-main-items-total-amount-row">
                                    <div className="single-invoice-main-items-total-amount-desc">Amount Due</div>
                                    <div className="single-invoice-main-items-total-amount">£ {singleInvoice.total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
