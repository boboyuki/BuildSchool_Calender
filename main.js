// 取現在年月
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
// 暫存年月
let yearVal = year;
let monthVal = month;
let dateId = '';
const weeks = ['日', '一', '二', '三', '四', '五', '六'];

// 增加 th 星期
let table = $('table');
let thead = $('thead tr');
let tbody = $('tbody');
let carouselInner = $('#carousel > .carousel-inner');
let deleteBtn = $('.modal-footer button:nth-child(1)');
let modifyBtn = $('.modal-footer button:nth-child(2)');
let addBtn = $('.modal-footer button:nth-child(3)');
weeks.forEach((week) => {
  let th = $('<th class="text-center"></th>');
  th.text(week);
  thead.append(th);
});

// 增加六列表格
for (let i = 0; i < 6; i++) {
  let tr = $('<tr></tr>');
  weeks.forEach(() => {
    let td = $(
      "<td><a class='d-inline-block w-100 h-100 p-2' data-toggle='modal' data-target='#staticBackdrop'></a></td>"
    );
    tr.append(td);
  });
  tbody.append(tr);
}

// 新增月份輪播
(() => {
  addCarouselItemInfo();
  addDays(year, month);
  loadNote();
})();

$('#carousel > .carousel-control-prev').click(function () {
  prevDateData();
  $('#carousel > .carousel-inner > .carousel-item').text(
    `${monthVal},${yearVal}`
  );
  addDays(yearVal, monthVal);
  loadNote();
});

$('#carousel > .carousel-control-next').click(function () {
  nextDateData();
  $('#carousel > .carousel-inner > .carousel-item').text(
    `${monthVal},${yearVal}`
  );
  addDays(yearVal, monthVal);
  loadNote();
});

$('tbody td a').click(function (e) {
  dateId = e.currentTarget.id;
  // 禁止冒泡會造成modal打不開，所以讓沒日期的加stopPropagation
  this.textContent === '' ? e.stopPropagation() : null;
  // 清空modal
  $('.modal .title').val('');
  $('.modal .start').val('');
  $('.modal .end').val('');
  $('.modal #note').val('');
  toggleBtn('block', 'none')
});

modifyBtn.click(function () {
  setLocalStorage($(this).attr('data-stamp'));
  loadNote();
});
deleteBtn.click(function () {
  localStorage.removeItem($(this).attr('data-stamp'));
  loadNote();
});
addBtn.click(function (e) {
  setLocalStorage(Date.now());
  loadNote();
});

function toggleBtn(add, other) {
  addBtn.css('display', add);
  deleteBtn.css('display', other);
  modifyBtn.css('display', other);
}
function addCarouselItemInfo() {
  let div = $('<div></div>');
  let p = $('<p></p>');
  div.addClass('carousel-item d-block');
  p.addClass('m-0 p-2');
  p.text(`${month},${year}`);
  carouselInner.append(div);
  $('.carousel-inner > .carousel-item').text(`${month},${year}`);
}
function nextDateData() {
  if (monthVal < 12) {
    monthVal++;
  } else {
    monthVal = 1;
    yearVal++;
  }
}
function prevDateData() {
  if (monthVal <= 12 && monthVal >= 2) {
    monthVal--;
  } else if (monthVal === 1) {
    monthVal = 12;
    yearVal--;
  }
}
function addDays(year, month) {
  let tdsContent = $('tbody td a');
  tdsContent.empty();
  tdsContent.attr('id', '');
  let week = new Date(year, month, 1).getDay();
  let monthDay = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < monthDay; i++) {
    tdsContent
      .eq(week + 1 + i)
      .attr('id', `${yearVal}-${monthVal}-${i + 1}`)
      .append($(`<p class="m-0">${i + 1}</p>`))
      .css("background-color", "#fefefe")
      .mouseenter(function () {
        $(this).css("background-color", "#FFFFCC")
      })
      .mouseleave(
        function () {
          $(this).css("background-color", "#fefefe")
        }
      );
  }
}
function setLocalStorage(key) {
  let title = $('.modal .title');
  let start = $('.modal .start');
  let end = $('.modal .end');
  let note = $('.modal #note');
  let color = $('.modal .color');
  if (
    title.val() === '' ||
    start.val() === '' ||
    end.val() === '' ||
    note.val() === ''
  ) {
    return alert('欄位不得為空');
  }
  let obj = {
    date: dateId,
    title: title.val(),
    startTime: start.val(),
    endTime: end.val(),
    noteText: note.val(),
    color: color.val(),
  };
  localStorage.setItem(key, JSON.stringify(obj));
}
function loadNote() {
  $('tbody tr td a').each(function () {
    $(this).children('.badge').remove();
    for (let i = 0; i < localStorage.length; i++) {
      let data = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if ($(this).attr('id') === data.date) {
        let badge = $(`<span class="d-inline-block badge"></span>`);
        badge.css('background-color', data.color);
        badge.css('color', '#fff');
        badge.text(data.title);
        badge.click(function (e) {
          dateId = $(this).parent().attr('id');
          $('.modal .title').val(data.title);
          $('.modal .start').val(data.startTime);
          $('.modal .end').val(data.endTime);
          $('.modal #note').val(data.noteText);
          $('.modal .color').val(data.color);
          modifyBtn.attr('data-stamp', localStorage.key(i));
          deleteBtn.attr('data-stamp', localStorage.key(i));
          toggleBtn("none", "block")
          // 禁止冒泡會造成modal打不開，所以要多加modal.show顯示
          e.stopPropagation();
          $('#staticBackdrop').modal('show');
        });
        $(this).append(badge);
      }
    }
  });
}
