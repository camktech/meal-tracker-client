$(document).ready(() => {
  var meal = [];
  var $results = $('#food-search-results').repeatable();
  var $searchTerm = $('#food-search-input');

  // set date
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if(dd<10) {
      dd = '0'+dd
  } 
  if(mm<10) {
      mm = '0'+mm
  }
  $('#date-input').val(`${yyyy}-${mm}-${dd}`);

  $('#food-search-button').click((e) => {
    e.preventDefault();

    queryUSDAPromise($searchTerm.val())
    .then((data) => {
      $('#food-search-results-container').removeClass('hidden');
      $results.value = data.list.item;
      $('.food-search-result').click((e) => {
        let item = $(e.currentTarget).data('result');
        let itemIndex = meal.indexOf(item);

        if(itemIndex < 0){
          meal.push(item);
          $('#meal-components').append(addMealComponentHTML(item));
          $('#meal-components .meal-component').unbind();
          $('#meal-components .meal-component').click((e) => {
            let remove = meal.find((mc) => {
              mc.ndbno == $(e.currentTarget).data('result').ndbno;
            });
            meal.splice(meal.indexOf(remove), 1);
            $(e.currentTarget).remove();
          });
        }

        if(meal.length > 0){
          $('#meal-components-container').removeClass('hidden');
        }
        else{
          $('#meal-components-container').addClass('hidden');
        }
      });
    })
    .catch((data) => {
      $('#food-search-results-container').addClass('hidden');
      notify('No results found', true)
    });
  });

  $('#add-to-meal-button').click(() => {
    $('#quantification-state-container').removeClass('hidden');
    let nutrients = [203, 204, 205, 208];
    let ndbnoList = [];
    for(item in meal){
      ndbnoList.push(meal[item].ndbno);
    }
    // to-add hide meal list
    $('#meal-components').html('');
    $('#meal-components-container').addClass('hidden');
    meal=[];


    foodNutritionUSDAPromise(ndbnoList, nutrients)
    .then((data) => {
      // build meal component html
      $('#food-component-reports').append(nutrientQuantificationHTML(data));
      $('.remove-meal-component').click((e) => {
        $(e.currentTarget).parents('.component-report').remove();
      });
      // on amount consumed change
      $('.food-measurement input').on('keyup mouseup', (e) => {
        let newValue = parseFloat(e.target.value);
        let originalMeasurementValue = parseFloat($(e.target.parentElement).find('.original-measurment-value').val())
        let changeFactor = newValue / originalMeasurementValue;
        let nutrientContnents = $(e.target.parentElement.parentElement.parentElement).find('.content-value');
        nutrientContnents.map((contentValue) => {
          let originalContentValue = parseFloat($(nutrientContnents[contentValue].parentElement).find('.original-content-value').val());
          if(isNaN(originalContentValue))
            originalContentValue = 0;
          $(nutrientContnents[contentValue]).text((originalContentValue * changeFactor).toFixed(2));
        });
      });
    })
    .catch((data) => {
      notify("There was a problem", true);
    });
  });

  $('#save-meal-button').click(() => {
    saveMeal({meal: buildMeal()})
    .then((data) => {
      console.log(data)
      notify('Success!')
    })
    .catch((data) => {
      notify("There was a problem", true);
    })
  });


  var queryUSDAPromise = function(query){
    return new Promise(
      (resolve, reject) => {
        $.get({
          url: `${HOST}/nutrition/search_foods`,
          data: {query: query}
        })
        .done((data) => {
          resolve(data)
        })
        .fail((data) => {
          reject(data)
        });
      }
    );
  }

  var foodNutritionUSDAPromise = function(ndbnoList, nutrients){
    return new Promise(
      (resolve, reject) => {
        $.get({
          url: `${HOST}/nutrition/show_food_nutrients`,
          data: {ndbno_list: ndbnoList, nutrients: nutrients}
        })
        .done((data) => {
          resolve(data);
        })
        .fail((data) => {
          reject(data);
        });
      }
    );
  }
});

var saveMeal = function(meal){
  return new Promise(
    (resolve, reject) => {
      $.post({
        url: `${HOST}/meals`,
        data: meal,
        xhrFields: {
          withCredentials: true
        }
      })
      .done((data) => {
        resolve(data);
      })
      .fail((data) => {
        reject(data);
      })
    }
  );
}

function buildMeal(){
  var mealJSON = {
    date: $('#date-input').val(),
    meal_components_attributes: buildMealComponents()
  }
  return mealJSON;
}

function buildMealComponents(){
  let mealComponents = []
  let $mealComponents = $('.meal-component');
  $mealComponents.each((mc) => {
    let mealComponent = {};
    mealComponent.usda_item_id = $($mealComponents[mc]).data('mealComponentNdbno');
    mealComponent.unit = $($mealComponents[mc]).data('mealComponentMeasurment');
    mealComponent.name = $($mealComponents[mc]).data('mealComponentName');
    mealComponent.quantity = $($mealComponents[mc]).find('.food-measurement input:first').val();
    mealComponent.nutrient_contents_attributes = [];
    let $nutrientContnents = $($mealComponents[mc]).find('.nutrient-contents .nutrient-content');
    $nutrientContnents.each((nc) => {
      let nutrientContnent = {};
      nutrientContnent.name = $($nutrientContnents[nc]).data('nutrientContentNutrient')
      nutrientContnent.usda_nutrient_id = $($nutrientContnents[nc]).data('nutrientContentNutrientId')
      nutrientContnent.value = parseFloat($($nutrientContnents[nc]).find('.content-value').text());
      nutrientContnent.unit = $($nutrientContnents[nc]).data('nutrientContentUnit')
      mealComponent.nutrient_contents_attributes.push(nutrientContnent);
    });
    mealComponents.push(mealComponent);
  });
  return mealComponents;
}

function addMealComponentHTML(item){
  return `<div class="meal-component row" data-result='${JSON.stringify(item)}'>
            <div class="twelve columns">
              <i class="fa fa-times-circle" aria-hidden="true"></i>
              ${item.name}
            </div>
          </div>`;
}

function nutrientQuantificationHTML(data){
  let html = "";
  for(mealComponent in data){
    let value = data[mealComponent].measure.match(/\d*\.\d+|\d+/)[0];
    let measurment = data[mealComponent].measure.replace(value, '');
    value = parseFloat(value);
    html += `<div class="row component-report">
              <div class="meal-component twelve columns" data-meal-component-name="${data[mealComponent].name}" data-meal-component-ndbno="${data[mealComponent].ndbno}" data-meal-component-measurment="${measurment}" data-meal-component-measurment-value="${value}">
                
                <div class="row">
                  <div class="eight columns food-name">${data[mealComponent].name}</div>
                  <div class="three columns food-measurement">
                     <input class="food-measurement-input" type="number" value=${value}> ${measurment}
                     <input type="hidden" class="original-measurment-value" value=${value}>
                  </div>
                  <div class="one columns">
                    <i class="fa fa-times-circle remove-meal-component" aria-hidden="true"></i>
                  </div>
                </div>

                <div class="nutrient-contents">
                  ${nutrientComponentHTML(data[mealComponent].nutrients)}
                </div>        

              </div>
            </div>`;
  }
  return html;    
}

function nutrientComponentHTML(nutrientContnents){
  let html = "";
  for(nutrient in nutrientContnents){
    if(isNaN(nutrientContnents[nutrient].value))
      nutrientContnents[nutrient].value = 0;
      html += `<div class="row nutrient-content" data-nutrient-content-nutrient="${nutrientContnents[nutrient].nutrient}" data-nutrient-content-unit="${nutrientContnents[nutrient].unit}" data-nutrient-content-nutrient-id="${nutrientContnents[nutrient].nutrient_id}">
                <div class="four columns nutrient-name overflow-scroll">
                  ${nutrientContnents[nutrient].nutrient}
                </div>

                <div class="six columns nutrient-value">
                  <span class="content-value">${nutrientContnents[nutrient].value}</span>
                  <input type="hidden" class="original-content-value" value=${nutrientContnents[nutrient].value}>
                  <span>${nutrientContnents[nutrient].unit}</span>
                </div>
              </div>`;
  }
  return html;
}
