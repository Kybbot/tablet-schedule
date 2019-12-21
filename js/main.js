load();
confirmDate();
updateTitle();
deleteSchedule();
addSchedule();

const openForm = document.getElementById('open-form');

openForm.addEventListener('click', function(event) {
	document.querySelector('.main-form').style.display = "flex";
});

const closeForm = document.getElementById('close-form');

closeForm.addEventListener('click', function(event) {
	document.querySelector('.main-form').style.display = "none";
});

function addSchedule(){
	const btnAddSchedule = document.getElementById('add-schedule');
	const scheduleTitle = document.getElementById('schedule-title');
	const scheduleDates = document.getElementById('schedule-dates');
	const schedulesContainer = document.querySelector('.schedules-container');

	btnAddSchedule.addEventListener('click', function(event) {
		if (scheduleTitle.value && scheduleDates.value) {
			const scheduleDiv = document.createElement('div');
			scheduleDiv.classList.add('schedule');

			const scheduleTitlerDiv = document.createElement('div');
			scheduleTitlerDiv.classList.add('schedule-title');
			scheduleTitlerDiv.setAttribute('contenteditable', 'true');
			scheduleTitlerDiv.textContent = scheduleTitle.value;

			const scheduleDeleteBtn = document.createElement('div');
			scheduleDeleteBtn.classList.add('schedule-delete-btn');
			scheduleDeleteBtn.setAttribute('title', 'Удалить Расписание!')
			scheduleDeleteBtn.innerHTML = '&times;';

			const dateContainer = document.createElement('div');
			dateContainer.classList.add('date-container');

			for (let i = 1; i <= scheduleDates.value; i++) {
				const scheduleDate = document.createElement('div');
				scheduleDate.classList.add('date');
				scheduleDate.textContent = i;
				dateContainer.append(scheduleDate);
			}

			scheduleDiv.append(scheduleTitlerDiv);
			scheduleDiv.append(scheduleDeleteBtn);
			scheduleDiv.append(dateContainer);

			schedulesContainer.append(scheduleDiv);
			scheduleTitle.value = '';
			scheduleDates.value = '';
			document.querySelector('.main-form').style.display = "none";
			confirmDate();
			deleteSchedule();
			save();
		} else {
			alert("Заплнити пожалуйста поля!");
		}
	});
}

function confirmDate() {
	document
	.querySelectorAll('.date')
	.forEach(x => {
		let flag = true;
		x.addEventListener('click', function(event) {			
			if (flag) {
				flag = false;
				this.classList.add('confirm-date');
				this.setAttribute('data-confirm', true);
				save();
			} else {
				flag = true;
				this.classList.remove('confirm-date');
				this.removeAttribute('data-confirm');
				save();
			}
		});
	});
}

function updateTitle() {
	document
		.querySelectorAll('.schedule-title')
		.forEach(x => {
			x.addEventListener('blur', () => {
				save();
			})
		})
}

function deleteSchedule() {
	document
		.querySelectorAll('.schedule-delete-btn')
		.forEach(x => {
			x.addEventListener('click', () => {
				const question = confirm('Удалить расписание ?');
				if (question) {
					x.parentElement.remove();
					save();
				}
			})
		})
}

function createSchedule(html) {
	const schedule = document.createElement('div');
	schedule.classList.add('schedule');
	schedule.innerHTML = html;

	return schedule;
}

function save() {
	const object = {
		items: []
	}

	document
		.querySelectorAll('.schedule')
		.forEach(element => {
			const item = {
				schedule: element.innerHTML
			}

			object.items.push(item);
		})

	const json = JSON.stringify(object);

	localStorage.setItem('data', json);

	return json;
}

function load() {
	if (!localStorage.getItem('data')) {
		return
	}

	let mountePoint = document.querySelector('.schedules-container');

	const object = JSON.parse(localStorage.getItem('data'));
	for (const item of object.items) {
		const scheduleElement = createSchedule(item.schedule);
		mountePoint.append(scheduleElement);
	}
}