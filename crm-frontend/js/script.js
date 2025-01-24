(async function () {

   // let clients = [
   //     {
   //         name: 'Денис',
   //         surname: 'Скворцов',
   //         lastname:'Юрьевич',
   //         createdAt: '',
   //         updatedAt:'',
   //         contacts: [
   //             {
   //               type: 'Телефон',
   //               value: '+71234567890'
   //             },
   //             {
   //               type: 'Email',
   //               value: 'sdu@xyz.com'
   //             },
   //             {
   //               type: 'Facebook',
   //               value: 'https://facebook.com/skvortsov-denis-the-best'
   //             }
   //           ]
   //     },
   //     {
   //         name: 'Арсений',
   //         surname: 'Куприянов',
   //         lastname:'Валерьевич',
   //         createdAt: '',
   //         updatedAt:'',
   //         contacts: [
   //             {
   //               type: 'Телефон',
   //               value: '+70987654321'
   //             },
   //             {
   //               type: 'Email',
   //               value: 'kav@xyz.com'
   //             },
   //             {
   //               type: 'Facebook',
   //               value: 'https://facebook.com/kupriyanov-arseniy-the-best'
   //             }
   //           ]
   //     },
   //     {
   //         name: 'Людмила',
   //         surname: 'Константинопольская',
   //         lastname:'Александровна',
   //         createdAt: '',
   //         updatedAt:'',
   //         contacts: [
   //             {
   //               type: 'Телефон',
   //               value: '+79786541320'
   //             },
   //             {
   //               type: 'Email',
   //               value: 'kla@xyz.com'
   //             },
   //             {
   //               type: 'Facebook',
   //               value: 'https://facebook.com/konstantinopolskaya-ludmila-the-best'
   //             }
   //           ]
   //     },
   //     {
   //         name: 'Олег',
   //         surname: 'Дмитриевский',
   //         lastname:'Алексеевич',
   //         createdAt: '',
   //         updatedAt:'',
   //         contacts: [
   //             {
   //               type: 'Телефон',
   //               value: '+71324576890'
   //             },
   //             {
   //               type: 'Email',
   //               value: 'doaa@xyz.com'
   //             },
   //             {
   //               type: 'Facebook',
   //               value: 'https://facebook.com/dmitrievskiy-oleg-the-best'
   //             }
   //           ]
   //     },
   //     {
   //         name: 'Татьяна',
   //         surname: 'Александрова',
   //         lastname:'Павловна',
   //         createdAt: '',
   //         updatedAt:'',
   //         contacts: [
   //             {
   //               type: 'Телефон',
   //               value: '+71597436820'
   //             },
   //             {
   //               type: 'Email',
   //               value: 'atp@xyz.com'
   //             },
   //             {
   //               type: 'Facebook',
   //               value: 'https://facebook.com/aleksandrova-tatyana-the-best'
   //             }
   //           ]
   //     },
   // ]


   const addClientBtn = document.querySelector('.add-client-btn')
   const searchInput = document.querySelector('.header__search')

   const sortBtn = document.querySelectorAll('.sort-btn')
   const IDBtn = document.querySelector('.ID-sort-btn')
   const FIOBtn = document.querySelector('.FIO-sort-btn')
   const createdAtBtn = document.querySelector('.create-date-sort-btn')
   const updatedAtBtn = document.querySelector('.changes-sort-btn')

   let clientsArray = await getClients()
   let tableElements
   tableElements = renderTable(clientsArray)

   // взаимодействие с сервером
   
   // получить студента с сервера
   async function getClients() {
      const response = await fetch('http://localhost:3000/api/clients', {
         method: 'GET',
         headers: {'Content-Type': 'application/json'},
      })
      return response.json()
   }

   // удаление клиента с сервера
   async function deleteClientDataById(id) {
      try {
          const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
              method: 'DELETE',
          });
  
          // проверяем статус ответа
          if (!response.ok) {
              if (response.status === 404) {
                  throw new Error('Клиент не найден')
              }
              throw new Error('Ошибка при удалении клиента')
          }
  
          return response
      } catch (error) {
          console.error('Ошибка при удалении:', error)
          throw error
      }
  }

   // обновление данных клиента на сервере
   async function updateClient(id, clientData) {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
         method: 'PATCH',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(clientData)
      })
      if (!response.ok) {
         throw new Error('Ошибка при обновлении данных клиента')
      }
      return response.json()
   }

   // добавление данных клиента на сервер
   async function addClientData(clientData) {
      const response = await fetch('http://localhost:3000/api/clients', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify(clientData)
      })
      if (!response.ok) {
         throw new Error('Ошибка при добавлении данных клиента на сервер')
      }
      return response.json()
   }

   // сортировка
   let isSorted = false
   // sortType - параметр указывает по какому свойству объекта нужно сортировать массив клиентов (ID, FIO, updatedAt, createdAt)
   function sortClients(arr, sortType) {

      let direction = true // по умолчанию сортировка по возрастанию

      // смена направления сортировки
      if (!isSorted) {
         direction = true
         isSorted = true
      } else {
         direction = false
         isSorted = false
      }

      // копируется массив клиентов и сортируется
      let copyClients = [...arr]
      let result = copyClients.sort(function(a,b) {

         
         if (sortType == 'ID') {
            for (const btn of sortBtn) {
               btn.classList.remove('is-active')
            }
            IDBtn.classList.add('is-active')

            let columnDir = a["id"] < b["id"]
            if (direction) columnDir = a["id"] > b["id"]
            if (columnDir) return -1
         } else

         if (sortType == 'FIO') {
            for (const btn of sortBtn) {
               btn.classList.remove('is-active')
            }
            FIOBtn.classList.add('is-active')
            
            let fullNameA = `${a['surname']} ${a['name']} ${a['lastName']}`
            let fullNameB = `${b['surname']} ${b['name']} ${b['lastName']}`
            let columnDir = fullNameA < fullNameB
            if (direction) columnDir = fullNameA > fullNameB
            
            if (columnDir) return -1
         } else

         if (sortType == 'updatedAt') {
            for (const btn of sortBtn) {
               btn.classList.remove('is-active')
            }
            updatedAtBtn.classList.add('is-active')

            let columnDir = new Date(a["updatedAt"]).getTime() < new Date(b["updatedAt"]).getTime()
            if (direction) columnDir = new Date(a["updatedAt"]).getTime() > new Date(b["updatedAt"]).getTime()
            if (columnDir) return -1
         } else

         if (sortType == 'createdAt') {
            for (const btn of sortBtn) {
               btn.classList.remove('is-active')
            }
            createdAtBtn.classList.add('is-active')

            let columnDir = new Date(a["createdAt"]).getTime() < new Date(b["createdAt"]).getTime()
            console.log(new Date(a["createdAt"]).getTime())
            if (direction) columnDir = new Date(a["createdAt"]).getTime() > new Date(b["createdAt"]).getTime()
            if (columnDir) return -1
         }
            
      })
      console.log(result)
      tableElements = renderTable(result)

      return result
   }

   // функция создания иконки контакта
   function createContactIcon(contact) {
      
      const contactWrap = document.createElement('a')
      contactWrap.classList.add('tbody__contact')
         
      switch(contact.type) {
         case 'Телефон':
            contactWrap.classList.add('contact-phone')
            break
         case 'Email':
            contactWrap.classList.add('contact-email')
            break
         case 'Facebook': 
            contactWrap.classList.add('contact-fb')
            break
         case 'VK':
            contactWrap.classList.add('contact-vk')
            break
         default:
            contactWrap.classList.add('contact-other')
      }

      // ссылка для перехода на страницу контакта
      contactWrap.href = contact.value
      contactWrap.title = `${contact.type}: ${contact.value}` //тултип для иконок контактов
   
      return contactWrap
   }

   // функция получение даты/времени
   function getDate(fullDate) {
      const dateTime = document.createElement('div')
      const dateSpan = document.createElement('span')
      const timeSpan = document.createElement('span')
      
      dateSpan.classList.add('date')
      timeSpan.classList.add('time')
      
      const now = new Date(fullDate)
      
      const day = now.toLocaleDateString()
      const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      
      dateSpan.textContent = day
      timeSpan.textContent = time

      dateTime.append(dateSpan, timeSpan)
      
      return dateTime
   }

   // взаимодействие с DOM-деревом
   function renderTable(arr) {
      // очистка таблицы 
      const tBody = document.querySelector('.tbody')        
      tBody.innerHTML = ''
      console.log('render')
      // создание массива для хранения строк таблицы
      const clientsElements = []
      // массив контактов
      const contactIcons = []
      
      // создание строки для каждого объекта
      for (const client of arr) {
         // создание строк таблицы
         const theadTR = document.createElement('tr')
         const idTD = document.createElement('td')
         const fioTD = document.createElement('td')
         const createDateTD = document.createElement('td')
         const lastUpdateTD = document.createElement('td')
         const contactsTD = document.createElement('td')
         const actionsTD = document.createElement('td')
         const actionsBox = document.createElement('div')
         const changeBtn = document.createElement('button')
         const deleteBtn = document.createElement('button')
      
         // назначение классов элементам
         theadTR.classList.add()
         idTD.classList.add('tbody-item', 'tbody-id')
         fioTD.classList.add('tbody-item')
         createDateTD.classList.add('tbody-item')
         lastUpdateTD.classList.add('tbody-item')
         contactsTD.classList.add('tbody-item')
         actionsTD.classList.add('tbody-item')
         changeBtn.classList.add('tbody-btn', 'change-btn')
         deleteBtn.classList.add('tbody-btn', 'delete-btn')
         
         // добавление значений ячейкам
         idTD.textContent = client.id
         fioTD.textContent = `${client.surname} ${client.name} ${client.lastName}`

         // добавление даты создания и даты последнего изменения
         createDateTD.append(getDate(client.createdAt))
         lastUpdateTD.append(getDate(client.updatedAt))

         // контакты
         const contactsBox = document.createElement('div')
         contactsBox.classList.add('tbody__contacts')

         // видимые контакты
         const visibleContacts = client.contacts.slice(0, 4)
         // скрытые контакты
         const hiddenContacts = client.contacts.slice(4)
         
         // добавление видимых контактов
         for (const contact of visibleContacts) {
            const contactIcon = createContactIcon(contact)
            contactsBox.append(contactIcon)
         }

         // если есть скрытые контакты, добавить иконку с количеством
         if (hiddenContacts.length > 0) {
            const moreContactsBtn = document.createElement('button')
            moreContactsBtn.classList.add('tbody__contact', 'contact-more')
            moreContactsBtn.textContent = `+${hiddenContacts.length}`
            
            // отображение скрытых контактов при клике на иконку
            moreContactsBtn.addEventListener('click', function() {
               moreContactsBtn.remove()
               // добавление скрытых контактов
               for (const contact of hiddenContacts) {
                  const contactIcon = createContactIcon(contact)
                  contactsBox.append(contactIcon)
               }
            })
            contactsBox.append(moreContactsBtn)
         }

         // добавление кнопок изменения и удаления
         changeBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z" fill="#9873FF"/>
         </svg>Изменить`
         deleteBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
         </svg>Удалить`

         // добавление элементов
         contactsBox.append(contactIcons)
         contactsTD.append(contactsBox)
         actionsBox.append(changeBtn, deleteBtn)
         actionsTD.append(actionsBox)
         theadTR.append(idTD, fioTD, createDateTD, lastUpdateTD, contactsTD, actionsTD)
         
         // добавление строки в таблицу
         tBody.append(theadTR)
         
         // добавление строки в массив строк
         clientsElements.push(theadTR)
      }

      // открытие модального окна изменения данных клиента
      let changeClientButtons = document.querySelectorAll('.change-btn')
      for (const changeBtn of changeClientButtons) {
         changeBtn.addEventListener('click', function(e) {
            openChangeClientModal(e.target)
         })
      }

      // открытие модального окна удаления клиента
      let deleteClientButtons = document.querySelectorAll('.delete-btn')
      for (const deleteBtn of deleteClientButtons) {
         deleteBtn.addEventListener('click', function(e) {
            e.preventDefault()
            const id = e.target.closest('tr').querySelector('.tbody-id').textContent
            const tr = e.target.closest('tr')
            openDeleteClientModal(id, tr)
         })
      }

      return clientsElements
   }

   // функция создания элемента контакта
   function createContactLayout(inputValue, selectValue, addContactBtn) {
      // создание контейнера для контакта
      const contactsChange = document.createElement('div')
      contactsChange.classList.add('modal__contacts-list')
   
      // создание select
      const select = document.createElement('select')
      select.classList.add('select')
   
      // создание input
      const input = document.createElement('input')
      input.classList.add('contact__input')
      input.type = 'text'
      input.placeholder = 'Введите данные контакта'
      input.value = inputValue || '' // если значение не передано, то пустая строка
   
      // создание кнопки удаления
      const deleteBtn = document.createElement('button')
      deleteBtn.classList.add('contact__clear-btn')
   
      // массив с вариантами для select
      const options = [
         { value: 'Телефон', text: 'Телефон' },
         { value: 'Email', text: 'Email' },
         { value: 'Facebook', text: 'Facebook' },
         { value: 'VK', text: 'VK' },
         { value: 'Другое', text: 'Другое' }
      ]
   
      // добавление options в select
      for (const opt of options) {
         const option = document.createElement('option')
         option.value = opt.value
         option.textContent = opt.text
         option.classList.add('select__option')
         
         // при совпадении текста опции с переданным значением, делаем её выбранной
         if (opt.text === selectValue) {
            option.selected = true
         }
         
         select.append(option)
      }
   
      // добавление элементов в контейнер
      contactsChange.append(select, input, deleteBtn)
      
   
      // инициализация Choices.js
      const choices = new Choices(select, {
         searchEnabled: false, // поиск не активен
         placeholder: false, // нет placeholder
         itemSelectText: '', // текст при выборе элемента
         allowHTML: true, // разрешение html
         position: 'bottom' // положение списка
      })
   
      // добавление обработчика удаления контакта
      deleteBtn.addEventListener('click', function(e) {
         e.preventDefault()   // отмена действия по умолчанию
         contactsChange.remove() // удаление контейнера с контактом
         
         // уменьшение счетчика контактов
         let currentContacts = document.querySelectorAll('.modal__contacts-list').length
         if (currentContacts < 10) { // если количество контактов меньше 10, то показываем кнопку добавления контакта
            addContactBtn.style.display = 'block'
         }
      });
   
      return contactsChange
   }

   
   function openAddClientModal() {
      // получение элементов модального окна
      const modal = document.querySelector('.new-client-modal')
      const form = modal.querySelector('.new-client-form')
      const contactsContainer = modal.querySelector('.modal__contacts-change')
      const addContactBtn = modal.querySelector('.modal__contacts-add-btn')
      const saveBtn = modal.querySelector('.modal__buttons-save-btn')
      const cancelBtn = modal.querySelector('.modal__buttons-cancel-btn')
      const closeBtn = modal.querySelector('.modal__close')
      const errorMessage = modal.querySelector('.modal__buttons-error')
      
      // получение полей ввода
      const inputSurname = modal.querySelector('#new-surname')
      const inputName = modal.querySelector('#new-name')
      const inputLastname = modal.querySelector('#new-lastname')
   
      // очистка формы при открытии 
      inputSurname.value = ''
      inputName.value = ''
      inputLastname.value = ''
      contactsContainer.innerHTML = ''
      errorMessage.style.display = 'none'
      errorMessage.textContent = ''
      addContactBtn.style.display = 'block'
      
   
      // функция добавления контакта
      function handleAddContact(e) {
         e.preventDefault()
         
         // проверка количества существующих контактов
         const currentContacts = contactsContainer.querySelectorAll('.modal__contacts-list')
         if (currentContacts.length >= 10) {
            addContactBtn.style.display = 'none'
            return
         }
         
         // создание нового элемента контакта
         const contactElement = createContactLayout('', 'Телефон', addContactBtn)
         contactsContainer.append(contactElement)
   
         // обновление видимости кнопки
         if (currentContacts.length + 1 >= 10) {
            addContactBtn.style.display = 'none'
         }
      }
   
      // функция сохранения нового клиента
      async function handleSave(e) {
         e.preventDefault()
   
         // валидация
         if (!inputName.value.trim()) {
            errorMessage.textContent = 'Введите имя клиента!'
            errorMessage.style.display = 'block'
            return
         }
   
         if (!inputSurname.value.trim()) {
            errorMessage.textContent = 'Введите фамилию клиента!'
            errorMessage.style.display = 'block'
            return
         }
   
         // сбор данных контактов
         // создание пустого массива для хранения контактов
         const contacts = []
         // получение всех контактов из контейнера
         const contactElements = contactsContainer.querySelectorAll('.modal__contacts-list')
         
         // проходим по каждому контакту и собираем данные
         for (const contact of contactElements) {
            // получаем тип контакта из select и значение контакта из input
            const type = contact.querySelector('.select').value
            const value = contact.querySelector('.contact__input').value.trim()
         
            // добавляение объекта с данными контакта в массив
            contacts.push({type, value})
            
         }
   
         // формирование данных нового клиента
         const newClientData = {
            name: inputName.value.trim(),
            surname: inputSurname.value.trim(),
            lastName: inputLastname.value.trim(),
            contacts
         }
         
         
         try {
            await addClientData(newClientData) // добавление нового клиента на сервер
            clientsArray = await getClients() // обновление списка клиентов
            renderTable(clientsArray) // обновление таблицы
            closeModal() // закрытие модального окна
         } catch(error) {
            errorMessage.textContent = 'Ошибка при сохранении данных'
            errorMessage.style.display = 'block' 
            console.error('Ошибка:', error)
         }
      }
   
      // функция закрытия модального окна
      function closeModal() {
         modal.classList.remove('open')
         document.body.style.overflow = 'auto'

         // удаление обработчиков событий
         addContactBtn.removeEventListener('click', handleAddContact)
         saveBtn.removeEventListener('click', handleSave)
         cancelBtn.removeEventListener('click', closeModal)
         closeBtn.removeEventListener('click', closeModal)
         modal.removeEventListener('click', handleOutsideClick)
         document.removeEventListener('keydown', handleEscPress)
      }
   
      // обработчики закрытия
      function handleEscPress(e) {
         if (e.key === 'Escape') closeModal()
      }
      
      // обработчик клика вне модального окна
      function handleOutsideClick(e) {
         if (e.target === modal) closeModal()
      }
  
      modal.classList.add('open')
      document.body.style.overflow = 'hidden'
   
      // добавление обработчиков событий
      addContactBtn.addEventListener('click', handleAddContact)
      saveBtn.addEventListener('click', handleSave)
      cancelBtn.addEventListener('click', closeModal)
      closeBtn.addEventListener('click', closeModal)
      document.addEventListener('keydown', handleEscPress)
      modal.addEventListener('click', handleOutsideClick)
   }

   // добавление обработчика клика на кнопку добавления клиента
   addClientBtn.addEventListener('click', openAddClientModal)

   // модальное окно изменения данных клиента
   async function openChangeClientModal(element) {
      const clientId = element.closest('tr').querySelector('.tbody-id').textContent
      const modal = document.querySelector('.change-data-modal')
      const form = modal.querySelector('.change-data-form')
      const clientIdSpan = modal.querySelector('#modal__id')
      const inputSurname = modal.querySelector('#update-surname')
      const inputName = modal.querySelector('#update-name')
      const inputLastname = modal.querySelector('#update-lastname')
      const contactsContainer = modal.querySelector('.modal__contacts-change')
      const addContactBtn = modal.querySelector('.modal__contacts-add-btn')
      const saveBtn = modal.querySelector('.modal__buttons-save-btn')
      const deleteBtn = modal.querySelector('.modal__buttons-cancel-btn')
      const errorMessage = modal.querySelector('.modal__buttons-error')
      const closeBtn = modal.querySelector('.modal__close')
   
      // очистка формы и контактов
      inputSurname.value = ''
      inputName.value = ''
      inputLastname.value = ''
      contactsContainer.innerHTML = ''
      errorMessage.textContent = ''
      errorMessage.style.display = 'none'
      let contactsCount = 0

   
      // поиск клиента
      const currentClient = clientsArray.find(client => client.id === clientId)
      if (!currentClient) {
         console.error('Клиент не найден')
         return
      }
   
      // заполнение данных
      clientIdSpan.textContent = currentClient.id
      inputSurname.value = currentClient.surname
      inputName.value = currentClient.name
      inputLastname.value = currentClient.lastName || ''
   
      // добавление существующих контактов
      if (currentClient.contacts && currentClient.contacts.length > 0) {
         currentClient.contacts.forEach(contact => {
            const contactElement = createContactLayout(contact.value, contact.type, addContactBtn)
            contactsContainer.append(contactElement)
            contactsCount++
         })
   
         if (contactsCount >= 10) {
            addContactBtn.style.display = 'none'
         }
      }
   
      // функция добавления контакта
      function handleAddContact(e) {
         e.preventDefault()
         
         // проверка количества существующих контактов
         const currentContacts = contactsContainer.querySelectorAll('.modal__contacts-list')
         if (currentContacts.length >= 10) {
            addContactBtn.style.display = 'none'
            return
         }
   
         const contactElement = createContactLayout('', 'Телефон', addContactBtn)
         contactsContainer.append(contactElement)
   
         // обновление видимости кнопки после добавления
         if (currentContacts.length + 1 >= 10) {
            addContactBtn.style.display = 'none'
         }
      }
   
      // функция сохранения
      async function handleSave(e) {
         e.preventDefault()
         
         // валидация   
         if (!inputName.value.trim()) {
            errorMessage.textContent = 'Введите имя клиента!'
            errorMessage.style.display = 'block'
            return
         }
   
         if (!inputSurname.value.trim()) {
            errorMessage.textContent = 'Введите фамилию клиента!'
            errorMessage.style.display = 'block'
            return
         }
   
         // сбор данных контактов
         // создание пустого массива для хранения контактов
         const contacts = []

         // получение всех контактов из контейнера
         const contactElements = contactsContainer.querySelectorAll('.modal__contacts-list')
                  
         // прохождение по каждому контакту и сбор данных
         for (const contact of contactElements) {
            // получение типа контакта из select
            const type = contact.querySelector('.select').value
            
            // получение значения контакта из input и удаление пробелов
            const value = contact.querySelector('.contact__input').value.trim()
            
            // добавляение объекта с данными контакта в массив
            contacts.push({type, value})
         }
   
         const updatedClient = {
            name: inputName.value.trim(),
            surname: inputSurname.value.trim(),
            lastName: inputLastname.value.trim(),
            contacts: contacts // массив с данными контактов
         }
   
         try {
            await updateClient(clientId, updatedClient)
            clientsArray = await getClients()
            tableElements = renderTable(clientsArray)
            closeModal()
         } catch (error) {
            errorMessage.textContent = 'Ошибка при сохранении данных'
            errorMessage.style.display = 'block'
            console.error(error)
         }
      }

      // Функция удаления клиента
      function handleDelete(e) {
         e.preventDefault()
         const tr = element.closest('tr') // получение строки таблицы
         openDeleteClientModal(clientId, tr) // открытие модального окна удаления
         closeModal() // закрытие модального окна
      }
   
      // закрытие модального окна
      function closeModal() {
         modal.classList.remove('open')
         document.body.style.overflow = 'auto'
         
         // удаление обработчиков событий
         addContactBtn.removeEventListener('click', handleAddContact)
         saveBtn.removeEventListener('click', handleSave)
         deleteBtn.removeEventListener('click', closeModal)
         closeBtn.removeEventListener('click', closeModal)
         document.removeEventListener('keydown', handleEscPress)
         modal.removeEventListener('click', handleOutsideClick)
      }
   
      // закрытие по нажатии Escape
      function handleEscPress(e) {
         if (e.key === 'Escape') {
            closeModal()
         }
      }

      // закрытие по клику вне модального окна
      function handleOutsideClick(e) {
         if (e.target === modal) {
            closeModal()
         }
      }
   
      // открытие модального окна
      modal.classList.add('open')
      document.body.style.overflow = 'hidden'
   
      // добавление обработчиков
      addContactBtn.addEventListener('click', handleAddContact)
      saveBtn.addEventListener('click', handleSave)
      deleteBtn.addEventListener('click', handleDelete, { once: true }) // однократное срабатывание
      closeBtn.addEventListener('click', closeModal)
      document.addEventListener('keydown', handleEscPress)
      modal.addEventListener('click', handleOutsideClick)
   }
     
   // функция открытия модального окна удаления
   function openDeleteClientModal(id, tr) { // id клиента и строка таблицы
      const deleteModal = document.querySelector('.delete-client-modal')
      const deleteBtn = deleteModal.querySelector('.modal__buttons-save-btn')
      const cancelBtn = deleteModal.querySelector('.modal__buttons-cancel-btn')
      const closeBtn = deleteModal.querySelector('.modal__close')

       
      deleteModal.classList.add('open')
      document.body.style.overflow = 'hidden'
   
      async function handleDelete() {
         try {
            await deleteClientDataById(id) // удаление клиента на сервере
            // если удаление прошло успешно, удаляется строка из таблицы
            tr.remove()
            closeModal() // закрывается модальное окно
            
            // обновление списка клиентов  
            clientsArray = await getClients()
            tableElements = renderTable(clientsArray)
         } catch(error) {
            console.error('Ошибка при удалении клиента:', error)
            errorMessage.style.display = 'block'
            console.error(error)
         }
      }

      // закрытие модального окна
      function closeModal() {
         deleteModal.classList.remove('open')
         document.body.style.overflow = 'auto'
         
         // удаление обработчиков событий
         deleteBtn.removeEventListener('click', handleDelete)
         cancelBtn.removeEventListener('click', closeModal)
         closeBtn.removeEventListener('click', closeModal)
         document.removeEventListener('keydown', handleEscPress)
         deleteModal.removeEventListener('click', handleOutsideClick)
      }

      // обработчики закрытия
      function handleEscPress(e) {
         if (e.key === 'Escape') {
            closeModal()
            
         }
      }
      
      // обработчик клика вне модального окна
      function handleOutsideClick(e) {
         if (e.target === deleteModal) {
            closeModal()

         }
      }
        
      // добавление обработчиков событий
      deleteBtn.addEventListener('click', handleDelete)
      cancelBtn.addEventListener('click', closeModal)
      closeBtn.addEventListener('click', closeModal)
      document.addEventListener('keydown', handleEscPress)
      deleteModal.addEventListener('click', handleOutsideClick)
           
   }

   // удаление клиента с сервера и таблицы
   async function deleteClient(id) {
      try {
         await deleteClientDataById(id)
         // обновление списка клиентов после удаления
         clientsArray = await getClients()
         tableElements = renderTable(clientsArray)
      } catch(error) {
         console.error('Ошибка при удалении клиента:', error)
         throw error
      }
   }

   // поиск клиентов
   function searchClients(clients, searchValue) {
      // поисковый запрос привести к нижнему регистру и убрать пробелы
      const search = searchValue.toLowerCase().trim()
      
      // если поисковый запрос пустой - возврат массива клиентов
      if (!search) {
         return clients
      }
      
      // Фильтрация клиентов
      return clients.filter(function(client) {
         // строка с полным именем клиента
         const fullName = `${client.surname} ${client.name} ${client.lastName}`.toLowerCase()
         
         // проверка совпадения по ID или полному имени
         return client.id.toString().includes(search) || 
               fullName.includes(search)
      })
   }

   // обработчик события для поля поиска
   searchInput.addEventListener('input', function(e) {
   const filterClients = searchClients(clientsArray, e.target.value) // поиск клиентов по введенному значению
   tableElements = renderTable(filterClients)
})

   // сортировка по умолчанию по ID по возрастанию
   sortClients(clientsArray, 'ID')
   if (isSorted) IDBtn.classList.toggle('arrow-up')

   // сортировка по ID
   IDBtn.addEventListener('click', () => {
      for (const btn of sortBtn) {
          btn.classList.remove('arrow-up')
      }
      sortClients(clientsArray, 'ID', true)
      if (isSorted) IDBtn.classList.toggle('arrow-up')
   })

  // сортировка по ФИО
  FIOBtn.addEventListener('click', () => {
   for (const btn of sortBtn) {
       btn.classList.remove('arrow-up')
   }
   sortClients(clientsArray, 'FIO', false)
   if (isSorted) FIOBtn.classList.toggle('arrow-up')
   })

   // сортировка по дате создания
   createdAtBtn.addEventListener('click', () => {
   for (const btn of sortBtn) {
       btn.classList.remove('arrow-up')
   }
   sortClients(clientsArray, 'createdAt', true)
   if (isSorted) createdAtBtn.classList.toggle('arrow-up')
   })

   // сортировка по дате последнего изменения
   updatedAtBtn.addEventListener('click', () => {
   for (const btn of sortBtn) {
       btn.classList.remove('arrow-up')
   }
   sortClients(clientsArray, 'updatedAt', true)
   if (isSorted) updatedAtBtn.classList.toggle('arrow-up')
   })
   

})()
