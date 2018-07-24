$(document).ready(() => {
  $('#fire').click(() => {
    $.get(getUrl($('#action').val()), (data, status) => {
      console.log(data)
    });
  });
});

function getUrl(action){
  let params = ""
  switch(action){
    case 'food search':
      params = "query=walnut&include_brands=false";
      return "http://localhost:3000/nutrition/search_foods?" + params;

    case 'group list':
      return "http://localhost:3000/nutrition/get_all_food_groups";

    case 'nutr list':
      return "http://localhost:3000/nutrition/get_all_nutrients";

    case 'by nutr':
      params = "nutrient_id=204&subset=1";
      return "http://localhost:3000/nutrition/get_foods_by_nutrient?" + params;

    case 'food nutr':
      params = "ndbno=05711&nutrients[]=203&nutrients[]=204";
      return "http://localhost:3000/nutrition/show_food_nutrients?" + params;
  }
}