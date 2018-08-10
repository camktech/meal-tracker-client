window.app.page('meal-history', () => {
  var $histroyContainer = $('#history-container');
  $.get({
    url: `${HOST}/meals`,
    xhrFields: {
      withCredentials: true
    }
  })
  .done((data) => {
    $histroyContainer.html(buildMealHistory(data));
  })
})

function buildMealHistory(data){
  let historyHTML = "";
  for(daySummary in data){
    let date = daySummary.split("-");
    date.push(date[0]);
    date.splice(0, 1);
    date = date.join("-");
    let nutrientsHTML = "";
    for(nutrient in data[daySummary]){
      console.log(daySummary)
      console.log(nutrient)
      nutrientsHTML += `<div class="three columns">${nutrient}: ${data[daySummary][nutrient].value + data[daySummary][nutrient].unit}</div>`;
    }
    historyHTML += `<div class="nutrition-summary">
                      <p class="meal-date">${date}</p>
                      <div class="row">
                        ${nutrientsHTML}
                      </div>
                    </div>`;
  }
  return historyHTML;
}