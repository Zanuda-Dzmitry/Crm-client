import {
	serverAddClient,
	serverGetClient,
	serverPatchClient,
	serverDeleteClient,
} from './srm-api.js'

// import {
// 	serverAddClient,
// 	serverGetClient,
// 	serverDeleteClient,
// 	serverPatchClient,
// } from './srm-local.js'

const appFormFilter = document.getElementById('app-form-filter'),
	appTable = document.getElementById('app-table'),
	appFormBtn = document.getElementById('app-form-btn'),
	containerBlok = document.getElementById('container-id')

// Начальный Hash.
location.hash = 'blok'

// Глобальные переменные для логики.
let quaContact = 0,
	dir = true,
	desClient

// Глобальный класс.
let contactBtnCloseActive = 'contact-btn-close--active',
	btnBlokContactOpen = 'btn-blok__contact--open',
	modalBtnContactOpen = 'modal__btn-contact--open',
	modalBtnContactDelete = 'modal__btn-contact--delete'

// 1. Форма фильтрации клиента.
function createFormFilter() {
	const divForm = document.createElement('div'),
		logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		logoUse = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
		inputFilter = document.createElement('input')

	// Классы.
	inputFilter.placeholder = 'Введите запрос'
	inputFilter.classList.add('client-form__input')
	logoSvg.classList.add('client-form__logo')
	divForm.classList.add('blok-filter')

	// Id.
	inputFilter.id = 'inputFilter'

	logoUse.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#logo-svg'
	)

	logoSvg.append(logoUse)
	divForm.append(logoSvg)
	divForm.append(inputFilter)
	appFormFilter.append(divForm)

	logoUse.addEventListener('click', () => {
		setTimeout(
			() => inputFilter.classList.toggle('client-form__input--active'),
			10
		)
		setTimeout(() => logoSvg.classList.toggle('client-form__logo--close'), 10)
	})
}

createFormFilter()

// 2. Таблица с наименованиями.
function createTableTitle() {
	const title = document.createElement('h1'),
		table = document.createElement('table'),
		thead = document.createElement('thead'),
		tr = document.createElement('tr'),
		thId = document.createElement('th'),
		thFullName = document.createElement('th'),
		thDate = document.createElement('th'),
		thLastChanges = document.createElement('th'),
		thContacts = document.createElement('th'),
		thActions = document.createElement('th'),
		svgId = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		useId = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
		svgFullName = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		useFullName = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
		svgDate = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		useDate = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
		svgChangesDate = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		),
		useChangesDate = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'use'
		),
		tbody = document.createElement('tbody')

	title.classList.add('title', 'container__blok')
	title.textContent = 'Клиенты'
	table.classList.add('table', 'container__blok')
	thead.classList.add('table__head')
	tr.classList.add('table__tr')
	thId.classList.add('table__th-title', 'th-id')
	thFullName.classList.add('table__th-title', 'th-full-name')
	thDate.classList.add('table__th-title', 'th-date')
	thLastChanges.classList.add('table__th-title', 'th-last-changes')
	thContacts.classList.add('table__th-title', 'th-contacts')
	thActions.classList.add('table__th-title', 'th-actions')
	tbody.classList.add('tbody')
	thId.textContent = 'ID'
	thFullName.textContent = 'Фамилия Имя Отчество'
	thDate.textContent = 'Дата и время создания'
	thLastChanges.textContent = 'Последние изменения'
	thContacts.textContent = 'Контакты'
	thActions.textContent = 'Действия'
	svgId.classList.add('th__svg')
	svgFullName.classList.add('th__svg')
	svgDate.classList.add('th__svg')
	svgChangesDate.classList.add('th__svg')

	tbody.id = 'tbody'
	tr.id = 'tr-title'
	thId.id = 'id'
	thFullName.id = 'surname'
	thDate.id = 'createdAt'
	thLastChanges.id = 'updatedAt'

	useId.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#th-id-svg'
	)
	useFullName.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#th-fullname-svg'
	)
	useDate.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#th-date-svg'
	)
	useChangesDate.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#th-changes-date-svg'
	)

	svgId.append(useId)
	svgFullName.append(useFullName)
	svgDate.append(useDate)
	svgChangesDate.append(useChangesDate)
	appTable.append(title)
	thId.append(svgId)
	thFullName.append(svgFullName)
	thDate.append(svgDate)
	thLastChanges.append(svgChangesDate)
	tr.append(thId)
	tr.append(thFullName)
	tr.append(thDate)
	tr.append(thLastChanges)
	tr.append(thContacts)
	tr.append(thActions)
	thead.append(tr)
	table.append(thead)
	table.append(tbody)
	appTable.append(table)
}

createTableTitle()

// Кнопка формы добавления клиента.
const btnFormClient = document.createElement('button'),
	svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
	use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

appFormBtn.classList.add('app-form-btn')
btnFormClient.classList.add('button-form')
svg.classList.add('button-form-svg')
btnFormClient.textContent = 'Добавить клиента'
use.setAttributeNS(
	'http://www.w3.org/1999/xlink',
	'href',
	'img/sprites.svg#button-form-svg'
)

svg.append(use)
btnFormClient.append(svg)
appFormBtn.append(btnFormClient)

// 1. Форма добавления клиента.
function createModalFormNowClient() {
	const modal = document.createElement('div'),
		modalBlok = document.createElement('form'),
		modalTitle = document.createElement('h2'),
		modalSpanId = document.createElement('span'),
		modalBtnClose = document.createElement('button'),
		modalBtnCloseSpan1 = document.createElement('span'),
		modalBtnCloseSpan2 = document.createElement('span'),
		modalLabelSurName = document.createElement('label'),
		modalInputSurName = document.createElement('input'),
		modalLabelName = document.createElement('label'),
		modalInputName = document.createElement('input'),
		modalLabelLastName = document.createElement('label'),
		modalInputLastName = document.createElement('input'),
		modalBtnBlok = document.createElement('div'),
		modalBtnBlokContact = document.createElement('div'),
		modalBtnContact = document.createElement('button'),
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		use = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
		modalBtnSaveClient = document.createElement('button'),
		modalBtnCanClient = document.createElement('button')

	// Текст.
	modalTitle.textContent = 'Новый клиент'
	modalBtnContact.textContent = 'Добавить контакт'
	modalBtnSaveClient.textContent = 'Сохранить'
	modalBtnCanClient.textContent = 'Отмена'
	modalInputSurName.placeholder = 'Фамилия'
	modalInputName.placeholder = 'Имя'
	modalInputLastName.placeholder = 'Отчество'
	modalInputSurName.dataset.surname = true
	modalInputName.dataset.name = true

	// Классы.
	modal.classList.add('modal')
	modalBlok.classList.add('modal__blok')
	modalTitle.classList.add('modal__title')
	modalBtnClose.classList.add('modal__btn-close')
	modalBtnCloseSpan1.classList.add('btn-close__span', 'btn-close__span-1')
	modalBtnCloseSpan2.classList.add('btn-close__span', 'btn-close__span-2')
	modalLabelSurName.classList.add('modal__label', 'modal__label-surname-new')
	modalLabelName.classList.add('modal__label', 'modal__label-name-new')
	modalLabelLastName.classList.add('modal__label')
	modalInputSurName.classList.add('modal-input', 'input-valid')
	modalInputName.classList.add('modal-input', 'input-valid')
	modalInputLastName.classList.add('modal-input')
	modalBtnBlok.classList.add('modal__btn-blok')
	modalBtnBlokContact.classList.add('btn-blok__contact')
	modalBtnContact.classList.add('modal__btn-contact')
	svg.classList.add('modal__btn-contact-svg')
	modalBtnSaveClient.classList.add('modal__btn', 'modal__btn-save')
	modalBtnCanClient.classList.add('modal__btn', 'modal__btn-delete')

	// Id.
	modalBlok.id = 'modalBlok'
	modalInputSurName.id = 'inputSurName'
	modalInputName.id = 'inputName'
	modalInputLastName.id = 'inputLastName'
	modalBtnBlok.id = 'modalBtnBlok'
	modalBtnSaveClient.id = 'BtnSaveClient'

	use.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#contact-set-svg'
	)

	svg.append(use)
	modalBtnContact.append(svg)
	modalLabelSurName.append(modalInputSurName)
	modalLabelName.append(modalInputName)
	modalLabelLastName.append(modalInputLastName)
	modalTitle.append(modalSpanId)
	modalBlok.append(modalTitle)
	modalBtnClose.append(modalBtnCloseSpan1)
	modalBtnClose.append(modalBtnCloseSpan2)
	modalBlok.append(modalBtnClose)
	modalBlok.append(modalLabelSurName)
	modalBlok.append(modalLabelName)
	modalBlok.append(modalLabelLastName)
	modalBtnBlokContact.append(modalBtnContact)
	modalBtnBlok.append(modalBtnSaveClient)
	modalBtnBlok.append(modalBtnCanClient)
	modalBlok.append(modalBtnBlokContact)
	modalBlok.append(modalBtnBlok)
	modal.append(modalBlok)
	containerBlok.append(modal)

	modalInputSurName.addEventListener('input', () => {
		if (modalInputSurName.value) {
			modalLabelSurName.classList.remove('modal__label-surname-new')
		} else {
			modalLabelSurName.classList.add('modal__label-surname-new')
		}
	})

	modalInputName.addEventListener('input', () => {
		if (modalInputName.value) {
			modalLabelName.classList.remove('modal__label-name-new')
		} else {
			modalLabelName.classList.add('modal__label-name-new')
		}
	})

	modalBtnClose.addEventListener('click', el => {
		el.preventDefault()
		modal.remove()
	})

	modalBtnCanClient.addEventListener('click', el => {
		el.preventDefault()
		modal.remove()
	})

	// Функция создания и добавления контактов клиента.
	function contactBlok() {
		const contactBlok = document.createElement('div'),
			contactSelect = document.createElement('select'),
			contactInputBlok = document.createElement('div'),
			contactOptionTel = document.createElement('option'),
			contactOptionEmail = document.createElement('option'),
			contactOptionVk = document.createElement('option'),
			contactOptionFacebook = document.createElement('option'),
			contactOptionOther = document.createElement('option'),
			contactInput = document.createElement('input'),
			contactBtnClose = document.createElement('button'),
			svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

		// Текст.
		contactOptionTel.textContent = 'Телефон'
		contactOptionOther.textContent = 'Другое'
		contactOptionEmail.textContent = 'Email'
		contactOptionVk.textContent = 'Vk'
		contactOptionFacebook.textContent = 'Facebook'
		contactInput.placeholder = 'Введите данные контакта'
		contactInput.dataset.contact = true

		// Value.
		contactOptionTel.value = 'Телефон'
		contactOptionOther.value = 'Другое'
		contactOptionEmail.value = 'Email'
		contactOptionVk.value = 'Vk'
		contactOptionFacebook.value = 'Facebook'

		// Классы.
		contactBlok.classList.add('contact-blok')
		contactSelect.classList.add('js-choice')
		contactInputBlok.classList.add('contact-input-blok')
		contactInput.classList.add('contact-input', 'input-valid')
		contactBtnClose.classList.add('contact-btn-close')
		svg.classList.add('contact-btn-close-svg')

		// Id.
		contactSelect.id = 'contactSelect'
		contactOptionTel.id = 'contactTel'
		contactOptionOther.id = 'contactLastTel'
		contactOptionEmail.id = 'contactEmail'
		contactOptionVk.id = 'contactVk'
		contactOptionFacebook.id = 'contactFacebook'
		contactInput.id = 'contactInput'
		contactBtnClose.id = 'contactBtnClose'

		use.setAttributeNS(
			'http://www.w3.org/1999/xlink',
			'href',
			'img/sprites.svg#modal-btn-contact-svg'
		)

		svg.append(use)
		contactBtnClose.append(svg)
		contactSelect.append(
			contactOptionTel,
			contactOptionEmail,
			contactOptionVk,
			contactOptionFacebook,
			contactOptionOther
		)
		contactInputBlok.append(contactInput)
		contactInputBlok.append(contactBtnClose)
		contactBlok.append(contactSelect)
		contactBlok.append(contactInputBlok)
		modalBtnBlokContact.append(contactBlok)

		// Кнопки создания и удаления новых контактных форм.
		contactBtnClose.addEventListener('click', function (el) {
			el.preventDefault()
			contactBlok.remove()
			quaContact = --quaContact
			if (quaContact <= 9) {
				modalBtnContact.classList.remove(modalBtnContactDelete)
			}

			if (quaContact == 0) {
				modalBtnBlokContact.classList.remove(btnBlokContactOpen)
				modalBtnContact.classList.remove(modalBtnContactOpen)
			}
		})

		contactInput.addEventListener('input', () => {
			if (!contactInput.value == '') {
				contactBtnClose.classList.add(contactBtnCloseActive)
			} else {
				contactBtnClose.classList.remove(contactBtnCloseActive)
			}
		})
	}

	modalBtnContact.addEventListener('click', function (el) {
		el.preventDefault()
		modalBtnBlokContact.classList.add(btnBlokContactOpen)
		modalBtnContact.classList.add(modalBtnContactOpen)
		if (quaContact === 9) {
			modalBtnContact.classList.add(modalBtnContactDelete)
		}
		contactBlok()
		choices()

		quaContact = ++quaContact
	})

	// Сохранение данных нового клиента.
	modalBtnSaveClient.addEventListener('click', async function (el) {
		el.preventDefault()
		await getClientItem(modal)
		renderingClientTable()
	})
}

// // 1. Форма изменения данных клиента.
function createModalFormClient(client, item) {
	const modalChange = document.createElement('div'),
		modalBlokChange = document.createElement('form'),
		modalTitle = document.createElement('h2'),
		modalSpanId = document.createElement('span'),
		modalBtnClose = document.createElement('button'),
		modalBtnCloseSpan1 = document.createElement('span'),
		modalBtnCloseSpan2 = document.createElement('span'),
		modalLabelSurName = document.createElement('label'),
		modalInputSurName = document.createElement('input'),
		modalLabelName = document.createElement('label'),
		modalInputName = document.createElement('input'),
		modalLabelLastName = document.createElement('label'),
		modalInputLastName = document.createElement('input'),
		modalBtnBlok = document.createElement('div'),
		modalBtnBlokContact = document.createElement('div'),
		modalBtnContact = document.createElement('button'),
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		use = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
		modalBtnSaveClient = document.createElement('button'),
		modalBtnDeleteClient = document.createElement('button')

	// Текст.
	modalTitle.textContent = 'Изменить данные'
	modalLabelSurName.textContent = 'Фамилия'
	modalLabelName.textContent = 'Имя'
	modalLabelLastName.textContent = 'Отчество'
	modalBtnContact.textContent = 'Добавить контакт'
	modalBtnSaveClient.textContent = 'Сохранить'
	modalBtnDeleteClient.textContent = 'Удалить клиента'

	// Классы.
	modalChange.classList.add('modal')
	modalBlokChange.classList.add('modal__blok')
	modalTitle.classList.add('modal__title')
	modalSpanId.classList.add('modal__title-span')
	modalBtnClose.classList.add('modal__btn-close')
	modalBtnCloseSpan1.classList.add('btn-close__span', 'btn-close__span-1')
	modalBtnCloseSpan2.classList.add('btn-close__span', 'btn-close__span-2')
	modalLabelSurName.classList.add('modal__label', 'modal__label-surname')
	modalLabelName.classList.add('modal__label', 'modal__label-name')
	modalLabelLastName.classList.add('modal__label')
	modalInputSurName.classList.add('modal-input')
	modalInputName.classList.add('modal-input')
	modalInputLastName.classList.add('modal-input')
	modalBtnBlok.classList.add('modal__btn-blok')
	modalBtnBlokContact.classList.add('btn-blok__contact')
	modalBtnContact.classList.add('modal__btn-contact')
	svg.classList.add('modal__btn-contact-svg')
	modalBtnSaveClient.classList.add('modal__btn', 'modal__btn-save')
	modalBtnDeleteClient.classList.add('modal__btn', 'modal__btn-delete')

	// Id.
	modalChange.id = 'modalChange'
	modalBlokChange.id = 'modalBlokChange'
	modalInputSurName.id = 'inputChangeSurName'
	modalInputName.id = 'inputChangeName'
	modalInputLastName.id = 'inputChangeLastName'
	modalSpanId.id = 'modalSpanId'
	modalBtnDeleteClient.id = 'BtnDeleteClient'
	modalBtnBlokContact.id = 'modalBtnBlokContact'
	modalBtnContact.id = 'modalBtnContact'
	modalBtnSaveClient.id = 'modalBtnSaveClient'

	use.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#contact-set-svg'
	)

	svg.append(use)
	modalBtnContact.append(svg)
	modalLabelSurName.append(modalInputSurName)
	modalLabelName.append(modalInputName)
	modalLabelLastName.append(modalInputLastName)
	modalTitle.append(modalSpanId)
	modalBlokChange.append(modalTitle)
	modalBtnClose.append(modalBtnCloseSpan1)
	modalBtnClose.append(modalBtnCloseSpan2)
	modalBlokChange.append(modalBtnClose)
	modalBlokChange.append(modalLabelSurName)
	modalBlokChange.append(modalLabelName)
	modalBlokChange.append(modalLabelLastName)
	modalBtnBlokContact.append(modalBtnContact)
	modalBtnBlok.append(modalBtnSaveClient)
	modalBtnBlok.append(modalBtnDeleteClient)
	modalBlokChange.append(modalBtnBlokContact)
	modalBlokChange.append(modalBtnBlok)
	modalChange.append(modalBlokChange)
	containerBlok.append(modalChange)

	modalInputSurName.value = client.surname
	modalInputName.value = client.name
	modalInputLastName.value = client.lastName
	modalSpanId.innerHTML = client.id

	client.contacts.forEach(el => {
		contactBlokChange(el.type, el.value)
		choices()
	})

	setTimeout(() => modalBlokChange.classList.add('modal-blok--active'), 10)

	// Сохранение измененных данных клиента.
	modalBlokChange.addEventListener('submit', async function (el) {
		el.preventDefault()

		patchClientItem(client.id)

		serverDataGet.forEach(function (el, i) {
			if (el.id === client.id) serverDataGet.splice(i, 1)
		})
		location.hash = 'blok'
	})

	// Кнопка удаление измененного клиента.
	modalBtnDeleteClient.addEventListener('click', el => {
		el.preventDefault()
		modalAlertDeleteClient(client, item)
		const modalAlertBlok = document.querySelector('.modal-alert__blok')
		setTimeout(() => modalAlertBlok.classList.add('modal-blok--active'), 10)
		modalChange.remove()
	})

	// Кнопка закрытия и удаления модального окна.
	modalBtnClose.addEventListener('click', el => {
		el.preventDefault()
		location.hash = 'blok'
		modalChange.remove()
	})

	// Кнопка создания нового блока контактов.
	modalBtnContact.addEventListener('click', function (el) {
		el.preventDefault()

		contactBlokChange()
		choices()
	})
}

// // Функция создания и добавления контактов клиента.
async function contactBlokChange(type, value) {
	const contactDiv = document.getElementById('modalBtnBlokContact')
	const contactBlok = document.createElement('div'),
		contactSelect = document.createElement('select'),
		contactInputBlok = document.createElement('div'),
		contactOptionTel = document.createElement('option'),
		contactOptionOther = document.createElement('option'),
		contactOptionEmail = document.createElement('option'),
		contactOptionVk = document.createElement('option'),
		contactOptionFacebook = document.createElement('option'),
		contactInput = document.createElement('input'),
		contactBtnClose = document.createElement('button'),
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

	// Текст.
	contactOptionTel.textContent = 'Телефон'
	contactOptionOther.textContent = 'Другое'
	contactOptionEmail.textContent = 'Email'
	contactOptionVk.textContent = 'Vk'
	contactOptionFacebook.textContent = 'Facebook'
	contactInput.placeholder = 'Введите данные контакта'

	// Value.
	contactOptionTel.value = 'Телефон'
	contactOptionOther.value = 'Другое'
	contactOptionEmail.value = 'Email'
	contactOptionVk.value = 'Vk'
	contactOptionFacebook.value = 'Facebook'

	if (type === contactOptionTel.value) {
		contactOptionTel.selected = true
		contactInput.value = value
	} else if (type === contactOptionOther.value) {
		contactOptionOther.selected = true
		contactInput.value = value
	} else if (type === contactOptionEmail.value) {
		contactOptionEmail.selected = true
		contactInput.value = value
	} else if (type === contactOptionVk.value) {
		contactOptionVk.selected = true
		contactInput.value = value
	} else if (type === contactOptionFacebook.value) {
		contactOptionFacebook.selected = true
		contactInput.value = value
	}

	// Классы.
	contactBlok.classList.add('contact-blok')
	contactSelect.classList.add('js-choice')
	contactInputBlok.classList.add('contact-input-blok')
	contactInput.classList.add('contact-input')
	contactBtnClose.classList.add('contact-btn-close')
	svg.classList.add('contact-btn-close-svg')

	use.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#modal-btn-contact-svg'
	)

	svg.append(use)
	contactBtnClose.append(svg)
	contactSelect.append(
		contactOptionTel,
		contactOptionOther,
		contactOptionEmail,
		contactOptionVk,
		contactOptionFacebook
	)
	contactInputBlok.append(contactInput)
	contactInputBlok.append(contactBtnClose)
	contactBlok.append(contactSelect)
	contactBlok.append(contactInputBlok)
	contactDiv.append(contactBlok)

	if (contactDiv.querySelector('.contact-blok')) {
		contactDiv.classList.add(btnBlokContactOpen)
		document
			.getElementById('modalBtnContact')
			.classList.add(modalBtnContactOpen)
	}

	let modalBtnContact = document.getElementById('modalBtnContact'),
		contactLength = document.querySelectorAll('.contact-blok').length

	if (contactLength === 10) modalBtnContact.classList.add(modalBtnContactDelete)

	contactBtnClose.addEventListener('click', function () {
		contactBlok.remove()
		contactLength = --contactLength
		if (!contactDiv.querySelector('.contact-blok')) {
			contactDiv.classList.remove(btnBlokContactOpen)
			document
				.getElementById('modalBtnContact')
				.classList.remove(modalBtnContactOpen)
		}

		if (contactLength < 10)
			modalBtnContact.classList.remove(modalBtnContactDelete)
	})

	// Логика кнопки удаления контактов.
	if (!contactInput.value == '') {
		contactBtnClose.classList.add(contactBtnCloseActive)
	}

	contactInput.addEventListener('input', () => {
		if (!contactInput.value == '') {
			contactBtnClose.classList.add(contactBtnCloseActive)
		} else {
			contactBtnClose.classList.remove(contactBtnCloseActive)
		}
	})
}

async function choices() {
	const element = document.querySelectorAll('.js-choice')
	element.forEach(el => {
		const choices = new Choices(el, {
			searchEnabled: false,
			itemSelectText: '',
			allowHTML: false,
		})
	})
}

// Модальный alert удаления клиента.
function modalAlertDeleteClient(client, item) {
	const modal = document.createElement('div'),
		modalBlok = document.createElement('div'),
		modalTitle = document.createElement('h2'),
		modalText = document.createElement('p'),
		modalBtnDelete = document.createElement('button'),
		modalBtnCancel = document.createElement('button'),
		modalBtnClose = document.createElement('button'),
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

	use.setAttributeNS(
		'http://www.w3.org/1999/xlink',
		'href',
		'img/sprites.svg#modal-alert-svg'
	)

	modal.classList.add('modal-alert')
	modalBlok.classList.add('modal-alert__blok')
	modalTitle.classList.add('modal-alert__title')
	modalText.classList.add('modal-alert__text')
	modalBtnDelete.classList.add('btn-reset', 'modal-alert__btn-delete')
	modalBtnCancel.classList.add('btn-reset', 'modal-alert__btn-cancel')
	modalBtnClose.classList.add('btn-reset', 'modal-alert__btn-close')
	svg.classList.add('modal-alert__btn-close-svg')

	modalTitle.textContent = 'Удалить клиента'
	modalText.textContent = 'Вы действительно хотите удалить данного клиента?'
	modalBtnDelete.textContent = 'Удалить'
	modalBtnCancel.textContent = 'Отмена'

	svg.append(use)
	modalBtnClose.append(svg)
	modalBlok.append(
		modalTitle,
		modalText,
		modalBtnDelete,
		modalBtnCancel,
		modalBtnClose
	)
	modal.append(modalBlok)
	containerBlok.append(modal)

	modalBtnDelete.addEventListener('click', el => {
		el.preventDefault()

		// Функция удаление клиента.
		async function deleteClient() {
			item.remove()
			modal.remove()
			serverDataGet.forEach(function (el, i) {
				if (el.id === client.id) serverDataGet.splice(i, 1)
			})

			await serverDeleteClient(client.id)
		}
		deleteClient()
	})

	modalBtnCancel.addEventListener('click', () => {
		location.hash = 'blok'
		modal.remove()
	})

	modalBtnClose.addEventListener('click', () => {
		location.hash = 'blok'
		modal.remove()
	})
}

// Отрисовка клиента.

let tbodyList = document.getElementById('tbody')

let serverDataGet = await serverGetClient()

async function renderingClientTable() {
	tbodyList.innerHTML = ''

	const inputFilter = document.getElementById('inputFilter').value
	//     let loader = document.createElement('span');
	//     tbodyList.append(loader);
	//     loader.classList.add('loader');

	//     window.addEventListener('load', () => {
	//     loader.classList.remove('loader');
	// })

	let copyArr = [...serverDataGet]

	// Фильтрация клиентов.
	if (inputFilter !== '')
		copyArr = filterClient(copyArr, 'surname', inputFilter)

	copyArr.forEach(client => {
		const item = document.createElement('tr'),
			idClient = document.createElement('td'),
			fullNameItem = document.createElement('td'),
			dateItem = document.createElement('td'),
			dateItemSpan = document.createElement('span'),
			lastChangesItem = document.createElement('td'),
			lastChangesItemSpan = document.createElement('span'),
			contactsItem = document.createElement('td'),
			contactsList = document.createElement('ul'),
			changeItem = document.createElement('td'),
			changeBtn = document.createElement('button'),
			changeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			changeUse = document.createElementNS('http://www.w3.org/2000/svg', 'use'),
			deleteBtn = document.createElement('button'),
			deleteSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
			deleteUse = document.createElementNS('http://www.w3.org/2000/svg', 'use')

		// Текст.
		fullNameItem.textContent =
			client.surname + ' ' + client.name + ' ' + client.lastName
		dateItem.textContent = new Date(client.createdAt).toLocaleDateString()
		dateItemSpan.textContent = new Date(client.createdAt)
			.toLocaleTimeString()
			.slice(0, -3)
		lastChangesItem.textContent = new Date(
			client.updatedAt
		).toLocaleDateString()
		lastChangesItemSpan.textContent = new Date(client.updatedAt)
			.toLocaleTimeString()
			.slice(0, -3)

		item.classList.add('tbody__tr')
		idClient.classList.add('tbody__td-id')
		dateItem.classList.add('tbody__td-date')
		lastChangesItem.classList.add('tbody__td-date')
		dateItemSpan.classList.add('tbody__td-date-span')
		lastChangesItemSpan.classList.add('tbody__td-date-span')
		contactsItem.classList.add('tbody__td-contact')
		changeItem.classList.add('tbody__td-change')
		changeBtn.classList.add('tbody__td-btn', 'tbody__td-btn-change')
		deleteBtn.classList.add('tbody__td-btn', 'tbody__td-btn-delete')
		changeSvg.classList.add('tbody__td-btn-svg', 'tbody__td-btn-svg-change')
		deleteSvg.classList.add('tbody__td-btn-svg', 'tbody__td-btn-svg-delete')

		changeUse.setAttributeNS(
			'http://www.w3.org/1999/xlink',
			'href',
			'img/sprites.svg#change-svg'
		)
		deleteUse.setAttributeNS(
			'http://www.w3.org/1999/xlink',
			'href',
			'img/sprites.svg#delete-svg'
		)

		for (let i = 0; i < client.contacts.length; i++) {
			const contactsItems = document.createElement('li'),
				contactsItemLink = document.createElement('a'),
				contactsItemSpanType = document.createElement('span'),
				contactsItemSpanValue = document.createElement('span'),
				svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
				use = document.createElementNS('http://www.w3.org/2000/svg', 'use')

			contactsItemSpanType.textContent = client.contacts[i].type + ':'
			contactsItemSpanValue.textContent = client.contacts[i].value
			contactsItemLink.href = client.contacts[i].value

			contactsItemLink.classList.add('contacts-items')
			contactsItemSpanType.classList.add('contacts-span')
			contactsItemSpanValue.classList.add('contacts-span-value')
			svg.classList.add('contacts-svg')

			// Логика добавления соответствующего svg.
			if (client.contacts[i].type === 'Телефон') {
				use.setAttributeNS(
					'http://www.w3.org/1999/xlink',
					'href',
					'img/sprites.svg#phone-svg'
				)
			} else if (client.contacts[i].type === 'Email') {
				use.setAttributeNS(
					'http://www.w3.org/1999/xlink',
					'href',
					'img/sprites.svg#email-svg'
				)
			} else if (client.contacts[i].type === 'Vk') {
				use.setAttributeNS(
					'http://www.w3.org/1999/xlink',
					'href',
					'img/sprites.svg#vk-svg'
				)
			} else if (client.contacts[i].type === 'Facebook') {
				use.setAttributeNS(
					'http://www.w3.org/1999/xlink',
					'href',
					'img/sprites.svg#facebook-svg'
				)
			} else {
				use.setAttributeNS(
					'http://www.w3.org/1999/xlink',
					'href',
					'img/sprites.svg#other-svg'
				)
			}

			svg.appendChild(use)
			contactsItemSpanType.append(contactsItemSpanValue)
			contactsItemLink.append(svg, contactsItemSpanType)
			contactsItems.append(contactsItemLink)
			contactsList.append(contactsItems)
		}

		changeBtn.textContent = 'Изменить'
		deleteBtn.textContent = 'Удалить'
		idClient.textContent = client.id
		changeBtn.id = 'changeBtn'
		deleteBtn.id = 'deleteBtn'

		// Классы.
		contactsList.classList.add('contacts-list')

		// Изменение данных клиента.
		changeBtn.addEventListener('click', async el => {
			el.preventDefault()

			location.hash = client.id
		})

		// Кнопка удаление клиента.
		deleteBtn.addEventListener('click', async function () {
			modalAlertDeleteClient(client, item)
			const modalAlertBlok = document.querySelector('.modal-alert__blok')
			setTimeout(() => modalAlertBlok.classList.add('modal-blok--active'), 10)
		})

		desClient = { item }

		changeSvg.append(changeUse)
		deleteSvg.append(deleteUse)
		dateItem.append(dateItemSpan)
		lastChangesItem.append(lastChangesItemSpan)
		contactsItem.append(contactsList)
		changeBtn.append(changeSvg)
		deleteBtn.append(deleteSvg)
		changeItem.append(changeBtn, deleteBtn)
		item.append(
			idClient,
			fullNameItem,
			dateItem,
			lastChangesItem,
			contactsItem,
			changeItem
		)
		tbodyList.append(item)
	})
}

// Создание данных клиента.
async function getClientItem(modal) {
	const appName = document.getElementById('inputName'),
		appSurname = document.getElementById('inputSurName'),
		appLastName = document.getElementById('inputLastName')

	// Исправление неправильного регистра.
	const oneLetterName = appName.value.substring(0, 1).toUpperCase(),
		lastLetterName = appName.value.substring(1).toLowerCase(),
		oneLetterSurname = appSurname.value.substring(0, 1).toUpperCase(),
		lastLetterSurname = appSurname.value.substring(1).toLowerCase(),
		oneLetterLastName = appLastName.value.substring(0, 1).toUpperCase(),
		lastLetterLastName = appLastName.value.substring(1).toLowerCase()

	const nameCorrect = oneLetterName + lastLetterName,
		surnameCorrect = oneLetterSurname + lastLetterSurname,
		lastNameCorrect = oneLetterLastName + lastLetterLastName

	const contact = []

	const select = document.querySelectorAll('.js-choice'),
		input = document.querySelectorAll('.contact-input')

	for (let i = 0; i < input.length; i++) {
		contact.push({
			type: select[i].value,
			value: input[i].value,
		})
	}

	let newClient = {
		name: nameCorrect.replace(/\s+/g, '').trim(),
		surname: surnameCorrect.replace(/\s+/g, '').trim(),
		lastName: lastNameCorrect.replace(/\s+/g, '').trim(),
		contacts: contact,
	}

	const modalBlok = document.getElementById('modalBlok'),
		modalBtnSave = document.getElementById('BtnSaveClient'),
		modalBlokContact = document.querySelector('.btn-blok__contact')

	const serverDataObj = await serverAddClient(newClient)
	console.log(serverDataObj)
	formValidation(
		serverDataObj,
		serverDataObj.errors,
		modal,
		modalBlok,
		modalBtnSave,
		modalBlokContact
	)
}

// Изменение данных клиента.
async function patchClientItem(id) {
	const appChangeName = document.getElementById('inputChangeName'),
		appChangeSurname = document.getElementById('inputChangeSurName'),
		appChangeLastName = document.getElementById('inputChangeLastName')

	// Исправление неправильного регистра.
	const oneLetterName = appChangeName.value.substring(0, 1).toUpperCase(),
		lastLetterName = appChangeName.value.substring(1).toLowerCase(),
		oneLetterSurname = appChangeSurname.value.substring(0, 1).toUpperCase(),
		lastLetterSurname = appChangeSurname.value.substring(1).toLowerCase(),
		oneLetterLastName = appChangeLastName.value.substring(0, 1).toUpperCase(),
		lastLetterLastName = appChangeLastName.value.substring(1).toLowerCase()

	const nameCorrect = oneLetterName + lastLetterName,
		surnameCorrect = oneLetterSurname + lastLetterSurname,
		lastNameCorrect = oneLetterLastName + lastLetterLastName

	const contact = []

	const select = document.querySelectorAll('.js-choice'),
		input = document.querySelectorAll('.contact-input')

	for (let i = 0; i < input.length; i++) {
		contact.push({
			type: select[i].value,
			value: input[i].value,
		})
	}

	let changeClient = {
		name: nameCorrect.replace(/\s+/g, '').trim(),
		surname: surnameCorrect.replace(/\s+/g, '').trim(),
		lastName: lastNameCorrect.replace(/\s+/g, '').trim(),
		contacts: contact,
	}

	const modalChange = document.getElementById('modalChange'),
		modalBlokChange = document.getElementById('modalBlokChange'),
		modalBtnSaveClient = document.getElementById('modalBtnSaveClient'),
		modalBlokContact = document.querySelector('.btn-blok__contact')

	let serverChangeClient = await serverPatchClient(id, changeClient)
	formValidation(
		serverChangeClient,
		serverChangeClient.errors,
		modalChange,
		modalBlokChange,
		modalBtnSaveClient,
		modalBlokContact
	)

	await renderingClientTable()
}

// Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.
const trTitle = document.getElementById('tr-title')

trTitle.querySelectorAll('th').forEach(el => {
	el.addEventListener('click', () => {
		;(dir = !dir), sortStudentArr(serverDataGet, el.id, el.lastChild)
	})
})

function sortStudentArr(arr, properties, svg) {
	svg.classList.toggle('th-id--sort')
	arr.sort((a, b) => {
		if (dir ? a[properties] < b[properties] : a[properties] > b[properties])
			return -1
	})

	renderingClientTable()
}

// Функция фильтрации клиентов.
function filterClient(arr, properties, value) {
	const filterMass = [],
		copyArr = [...arr]

	// Исправление регистра для поиска.
	let oneLetterValue = value.substring(0, 1).toUpperCase(),
		lastLetterValue = value.substring(1).toLowerCase(),
		nowValue = oneLetterValue + lastLetterValue

	copyArr.forEach(item => {
		if (item[properties].includes(nowValue) == true) filterMass.push(item)
	})

	return filterMass
}

// Форма валидации клиента.
function formValidation(
	errors,
	errorsMes,
	modal,
	modalBlok,
	modalBtnSave,
	modalBlokContact
) {
	// Удаление ошибок.
	modalBlok.querySelectorAll('.error-label').forEach(label => {
		if (label.classList.contains('error-label')) {
			modalBlok.querySelector('.error-label').remove()
			label.classList.remove('error-label')
		}
	})

	// Текст ошибок.
	if (errorsMes !== undefined) {
		errorsMes.forEach(error => {
			const errorLabel = document.createElement('label')

			errorLabel.textContent = error.message
			errorLabel.classList.add('error-label')

			const theLastChild = modalBlok.lastChild
			modalBlok.insertBefore(errorLabel, theLastChild)
			modalBtnSave.style.marginTop = '10px'
			modalBlokContact.style.marginBottom = '10px'
		})
	} else {
		modal.remove()
		serverDataGet.push(errors)
	}
}

// Кнопка создания формы для добавления нового клиента.
btnFormClient.addEventListener('click', function (el) {
	el.preventDefault()
	createModalFormNowClient()

	const modalBlok = document.getElementById('modalBlok')
	setTimeout(() => modalBlok.classList.add('modal-blok--active'), 10)
})

// Input для фильтрации клиентов по surname.
const input = document.getElementById('inputFilter')
let text = null

function inputText() {
	renderingClientTable()
}

function deferredText() {
	text = clearTimeout(text)
	text = setTimeout(inputText, 300)
}

input.addEventListener('input', deferredText)

// Постоянная отрисовка массива.
renderingClientTable()

// Отрисовка карточки клиента через Hash.
function locationHashChanged() {
	let copyArr = [...serverDataGet]

	copyArr.forEach(clients => {
		const { item } = desClient
		if (location.hash === '#' + clients.id) {
			createModalFormClient(clients, item)
		}
	})
}
window.onhashchange = locationHashChanged
