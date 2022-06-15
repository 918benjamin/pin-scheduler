function arrOfDates(startDate, daysCount) {
  const result = [];
  let next = startDate;

  for (let i = 0; i < daysCount; i += 1) {
    result.push(new Date(next.toDateString()));
    next.setDate(next.getDate() + 1);
  }

  return result;
}

function sliceIntoChunks(arr, chunkSize) {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);
      result.push(chunk);
  }
  return result;
}

function chunksToObjs(chunks, rowSize) {
  let result = [];
  for (let i = 0, j = 1; i < chunks.length; i += rowSize, j += 1) {
    const rows = chunks.slice(i, i + rowSize);
    result.push({number: j, rows: rows})
  }
  return result;
}

function todayString() {
  const today = new Date();
  const year = today.getFullYear();
  const day = today.getDate();
  let month = today.getMonth() + 1;

  if (month < 10) {
    month = `0${month}`;
  }

  return `${year}-${month}-${day}`;
}

function initializeFormDefaults(form, templates) {
  form.elements.startDate.value = todayString();
  form.elements.days.value = 5;
  form.elements.graphics.value = 4;
  form.elements.boards.value = 3;
  renderTable(form, templates);
}

function renderTable(form, templates) {
  const main = document.querySelector('main');
  const startDate = new Date(form.elements.startDate.value.replace(/-/g, '\/'));
  const days = parseInt(form.elements.days.value, 10);
  const graphics = parseInt(form.elements.graphics.value, 10);
  const boards = parseInt(form.elements.boards.value, 10);

  const daysCount = days * graphics * boards;
  const datesArr = arrOfDates(startDate, daysCount);
  const dateStringsArr = datesArr.map(date => {
    return `${date.getMonth()+1}/${date.getDate()}`
  })

  let daysArr = [];
  for (let i = 1; i <= days; i += 1) {
    daysArr.push(i);
  }

  let tableData = {
    graphics: graphics,
    days: daysArr,
    boards: chunksToObjs(sliceIntoChunks(dateStringsArr, days), graphics),
  };

  main.innerHTML = templates.table(tableData);
}

document.addEventListener('DOMContentLoaded', () => {
  const templates = {};
  const form = document.querySelector('form');

  document.querySelectorAll('[type="text/x-handlebars"]').forEach(template => {
    templates[template.id] = Handlebars.compile(template.innerHTML)
  });

  document.querySelectorAll('[data-type=partial]').forEach(partial => {
    Handlebars.registerPartial(partial.id, partial.innerHTML);
  });

  Handlebars.registerHelper("inc", function(value, options) {
    return parseInt(value, 10) + 1;
  });

  Handlebars.registerHelper("ifEqlZero", function(value, options) {
    return value === 0;
  })

  initializeFormDefaults(form, templates);

  form.addEventListener('input', e => {
    renderTable(form, templates);
  })
});