const openForm = document.getElementById('open-form');
const closeForm = document.getElementById('close-form');

openForm.addEventListener('click', function() {
	document.querySelector('.main-form').style.display = "flex";
});

closeForm.addEventListener('click', function() {
	document.querySelector('.main-form').style.display = "none";
});

const btnAddSchedule = document.getElementById('add-schedule');
const scheduleTitle = document.getElementById('schedule-title');
const scheduleDates = document.getElementById('schedule-dates');
const schedulesContainer = document.querySelector('.schedules-container');

load();
confirmDate();
updateTitle();
deleteSchedule();

btnAddSchedule.addEventListener('click', function() {
	if (scheduleTitle.value && scheduleDates.value) {
		
		save(createSchedule(scheduleTitle.value, scheduleDates.value));
		clear();
		load();

		scheduleTitle.value = '';
		scheduleDates.value = '';
		document.querySelector('.main-form').style.display = "none";

		confirmDate();
		updateTitle();
		deleteSchedule();
	} else {
		alert("Заплнити пожалуйста поля!");
	}
});

function confirmDate() {
	document
	.querySelectorAll('.date')
	.forEach(x => {
		x.addEventListener('click', function() {	
			let schedules = JSON.parse(localStorage.getItem('data'));
			let title = x.parentElement.getAttribute('date-container-name');
			let index = schedules.findIndex(item => item.title === title);
			let obj = schedules.find(item => item.title === title);
			let dates = obj.dates;
			let date = dates.find(item => item.date == x.textContent);

			if (x.classList.value.includes('confirm-date')) {
				this.classList.remove('confirm-date');

				date.completed = false;
				let newObj = {
					title: x.parentElement.getAttribute('date-container-name'),
					dates: dates
				}
				schedules.splice(index, 1, newObj);
				const json = JSON.stringify(schedules);
				localStorage.setItem('data', json);
			} else {
				this.classList.add('confirm-date');

				date.completed = true;
				let newObj = {
					title: x.parentElement.getAttribute('date-container-name'),
					dates: dates
				}
				schedules.splice(index, 1, newObj);
				const json = JSON.stringify(schedules);
				localStorage.setItem('data', json);
				updateTitle();
				deleteSchedule();
			}
		});
	});
}

function updateTitle() {
	let schedules = JSON.parse(localStorage.getItem('data'));
	let name = '';
	let obj = {};
	let index = '';
	let newName = '';
	
	document
		.querySelectorAll('.schedule-title')
		.forEach(x => {
			x.addEventListener('click', function() {
				name = x.textContent;
				obj = schedules.find(item => item.title === name);
				index = schedules.findIndex(item => item.title === name);
			});
			x.addEventListener('input', function() {
				newName = x.textContent;
				obj.title = newName;
			});
			x.addEventListener('blur', function() {
				schedules.splice(index, 1, obj);
				const json = JSON.stringify(schedules);
				localStorage.setItem('data', json);
				clear();
				load();
				updateTitle();
				confirmDate();
				deleteSchedule();
			});
		});
}

function deleteSchedule() {
	document
		.querySelectorAll('.schedule-delete-btn')
		.forEach(x => {
			x.addEventListener('click', () => {
				let schedules = JSON.parse(localStorage.getItem('data'));
				let name = x.previousElementSibling.textContent;
				let index = schedules.findIndex(item => item.title === name);
				const question = confirm('Удалить расписание ?');
				if (question) {
					schedules.splice(index, 1);
					const json = JSON.stringify(schedules);
					localStorage.setItem('data', json);
					x.parentElement.remove();
				}
			});
		});
}

function clear() {
	let element = document.querySelector(".schedules-container");
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function save(schedule) {
	if (localStorage.getItem('data')) {	
		const schedules = JSON.parse(localStorage.getItem('data'));
		schedules.push(schedule);

		const json = JSON.stringify(schedules);
		localStorage.setItem('data', json);
	} else {
		const schedules = [];
		schedules.push(schedule);

		const json = JSON.stringify(schedules);
		localStorage.setItem('data', json);
	}
}

function load() {
	if (!localStorage.getItem('data')) {
		return
	}

	const object = JSON.parse(localStorage.getItem('data'));
	renderSchedule(object);
}

function renderSchedule(data) {
	data.map(item => {
		const scheduleDiv = document.createElement('div');
		scheduleDiv.classList.add('schedule');

		const scheduleTitleDiv = document.createElement('div');
		scheduleTitleDiv.classList.add('schedule-title');
		scheduleTitleDiv.setAttribute('contenteditable', 'true');
		scheduleTitleDiv.textContent = item.title;

		const scheduleDeleteBtn = document.createElement('div');
		scheduleDeleteBtn.classList.add('schedule-delete-btn');
		scheduleDeleteBtn.setAttribute('title', 'Удалить Расписание!')
		scheduleDeleteBtn.innerHTML = '&times;';

		const dateContainer = document.createElement('div');
		dateContainer.classList.add('date-container');
		dateContainer.setAttribute('date-container-name', item.title);

		item.dates.map(date => {
			const scheduleDate = document.createElement('div');
			scheduleDate.classList.add('date');
			scheduleDate.textContent = date.date;
			scheduleDate.setAttribute('date-confirm', date.completed);
			if(date.completed) {
				scheduleDate.classList.add('confirm-date');
			}
			dateContainer.append(scheduleDate);
		});

		scheduleDiv.append(scheduleTitleDiv);
		scheduleDiv.append(scheduleDeleteBtn);
		scheduleDiv.append(dateContainer);

		schedulesContainer.append(scheduleDiv);
	});
}

function createSchedule(title, dates) {
	let datesArr = [];

	for (let i = 1; i <= dates; i++) {
		datesArr.push({
			date: i,
			completed: false
		})
	}

	return {
		title: title,
		dates: datesArr
	}
}