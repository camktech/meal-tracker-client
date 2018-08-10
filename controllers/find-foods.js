$(document).ready(() => {

  allNutrientsUSDA();
  allFoodGroups();
  $('#find-foods-button').click(() => {
    if($('#nutrient-select').val()){
      findFoodsByNutrient($('#nutrient-select').val())
    }
    else{
      notify('You must specify a nutrient', true);
    }
  });
  
});

function populateNutrientSelect(data){
  let $nutrientSelect = $('#nutrient-select');
  let optionsHTML = "";
  data.list.item.forEach((nut) => {
    optionsHTML += `<option value=${nut.id}>${nut.name}</option>`;
  });
  $nutrientSelect.append(optionsHTML);
  $('#nutrient-select').selectize({
    create: false,
    sortField: {
      field: 'text',
      direction: 'asc'
    },
    dropdownParent: 'body'
  });
}

function populateFoodGroupSelect(data){
  let $foodGroupSelect = $('#food-group-select');
  let optionsHTML = "";
  data.list.item.forEach((fg) => {
    optionsHTML += `<option value=${fg.id}>${fg.name}</option>`
  });
  $foodGroupSelect.append(optionsHTML);
  $('#food-group-select').selectize({
    create: false,
    sortField: {
      field: 'text',
      direction: 'asc'
    },
    dropdownParent: 'body'
  });
}

function populateResults(data){
  let resultHtml = "";
  data.report.foods.forEach((food) => {
    resultHtml += `<div class="row">
      <div class="six columns">${food.name}</div>
      <div class="six columns">${food.nutrients[0].gm} g.</div>
    </div>`;
  });
  $('#find-results-container').removeClass('hidden');
  $('#find-results-container').append(resultHtml);
}


function allNutrientsUSDA(){
  let options = {
    url: `${HOST}/nutrition/get_all_nutrients`
  };

  apiRequest(options)
  .then((data) => {
    console.log(data)
    populateNutrientSelect(data);
  })
  .catch((data) => {
    console.log(data)
  });
}

function allFoodGroups(){
  let options = {
    url: `${HOST}/nutrition/get_all_food_groups`
  };

  apiRequest(options)
  .then((data) => {
    console.log(data)
    populateFoodGroupSelect(data);

  })
  .catch((data) => {

  })
}

function findFoodsByNutrient(nutId){
  let options = {
    url: `${HOST}/nutrition/get_foods_by_nutrient`,
    data: {nutrient_id: nutId}
  }

  apiRequest(options)
  .then((data) => {
    console.log(data)
    populateResults(data);
  })
  .catch((data) => {
    console.log(data)
  });
}

var apiRequest = (options) => {
  return new Promise(
    (resolve, reject) => {
      $.get(options)
      .done((data) => {
        resolve(data);
      })
      .fail((data) => {
        reject(data);
      });
    }
  )
}