//---------------------------------------- Global Variables -----------------------------------------------------------
var database = firebase.database();
var ingredients = [];
var pantry = [];
var counter = 0;
var apiKey = '3587444';

// --------------------------------------- Global Functions ---------------------------------------

function dragstart_handler(ev) {
    console.log("dragStart");
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.effectAllowed = "copy";
}

function dragover_handler(ev) {
    // Set the dropEffect to move
    ev.currentTarget.style.background = "rgb(255, 221, 212)";
    ev.dataTransfer.dropEffect = "copy";
    ev.preventDefault();
}
function drop_handler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    var data = ev.dataTransfer.getData("text/plain");
    ev.target.appendChild(document.getElementById(data));
    ev.currentTarget.style.background = "white";
}
function dragend_handler(ev) {
    console.log("dragEnd");
    // Remove all of the drag data
    ev.dataTransfer.clearData();
}

//---------------------------------------- On Click Functions ---------------------------------------------------------
$('#add-ingredients').on('click', function() {

    var ingredient = $('#ingredients-input').val().trim();

    ingredients.push(ingredient);
    console.log(ingredients);

    var ingredientDiv = $("<div id='" + ingredients[counter] + "' class='ingredient'  draggable='true' ondragstart='dragstart_handler(event);' ondragend='dragend_handler(event);'>" + ingredients[counter] + "<span class='remove'> x</span>" + "</div>");

    $('#ingredients').append(ingredientDiv);

    $('#ingredients-input').val('');


    console.log(counter);
    counter++;
})

$('#search-button').on('click', function() {
    var apiKey = '3587444';

    var queryURL = 'https://www.thecocktaildb.com/api/json/v2/' + apiKey + '/filter.php?i=' + ingredients;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        var drinkResults = response.drinks;
        var selectedDrinks = [];
        var limitFilter = 4;
        


        for (var i = 0; i < limitFilter; i++) {
            //Find and Select Drinks
            var randomizeDrink = Math.floor(Math.random() * drinkResults.length);
            var drink = drinkResults[randomizeDrink];
            

            selectedDrinks.push(drink);

            //Make Drink Card
            var drinkCard = $('<div class="drinkCard">');
            var drinkID = drink.idDrink;
            drinkCard.attr('data-isFave', 'false');
            drinkCard.attr('data-drinkID', drinkID);
            var drinkName = $('<header class="drinkName">' + drink.strDrink + '</div>');
            var drinkImg = $("<img class='imgDrink' src='" + drink.strDrinkThumb + "'>");
            var drinkFav = $("<div class='favorite'><i class='fas fa-heart'></i></div>");

            //Add Card to Page
            drinkCard.append(drinkName);
            drinkCard.append(drinkImg);
            drinkCard.append(drinkFav);
            $('#results').append(drinkCard);


            console.log(i);
            console.log(JSON.stringify(selectedDrinks));

        }


    })
})

$(document).on('click', '.drinkCard', function() {
    if ($(this).attr('data-isFave') === 'false') {
        $(this).attr('data-isFave', 'true');
        $(this).find('.fa-heart').css('color', '#765265');
        // $(this).find('.drinkName').css('color', '#351C4D');
        $(this).css('border', '3px solid #351C4D');
    } else {
        $(this).attr('data-isFave', 'false');
        $(this).find('.fa-heart').css('color', 'white');
        $(this).find('.drinkName').css('color', 'white');
        $(this).css('border', 'none');
    }
    var self = $(this);
    var drinkID = self.attr('data-drinkID');
    console.log(drinkID);
    var queryURL = 'https://www.thecocktaildb.com/api/json/v2/' + apiKey + '/lookup.php?i=' + drinkID;
    var recipe;
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        var searchedDrink = response.drinks[0];
        recipe = response.drinks[0].strInstructions;
        console.log(recipe);
        var count = 1;
        var drinkIngDiv = $("<div class='drinkIngredients'> <strong>Ingredients: </strong>");
        for(var key in searchedDrink) {
             
            if(searchedDrink[key] !== '' && searchedDrink[key] !== null && key.indexOf('strIngredient') !== -1) {
                   
                console.log(count + '= ' + key + ': ' + searchedDrink[key]);

                var itemDiv = $("<span class='drinkIng'>" + searchedDrink[key] + ", " + "</span>");
                drinkIngDiv.append(itemDiv);
                self.append(drinkIngDiv);
                
                
                count++;
            } 
        }

        self.append("<div class='recipe'><strong>Instructions: </strong>" + recipe + "</div>");
    });

})

$(document).on('click', '.ingredient', function() {

    var indexOfClicked = $('.ingredient').index(this);
    ingredients.splice(indexOfClicked, 1);

    console.log(indexOfClicked);
    console.log(ingredients);

    counter--;

    $(this).remove();
    
});

$(document).on('click', '#pantry-button', function() {
    var ingredient = $('#pantry-input').val().trim();
    pantry.push(ingredient);
    console.log(pantry);
    var pantryIng = $("<div class='pantryIngredient'>" + ingredient + "</div>");
    $('#pantry-storage').append(pantryIng);
    
});


// -----------------------------------------ADDED FAVORITE FUNCTION------------------------------------------------------
// var favArray = [];

// $(document.body).on('click', '.fa-heart', function(){
//     $('.fas').parent().push(favArray);
//     console.log(this);
//     localStorage.setItem(favArray);
//     $('.fav-drink-section').append(localStorage.getItem(favArray));
//     database.ref().push({
//         favArray: favArray
//     });
// });
// database.ref().on("child_added", function(snapshot) {
//     // storing the snapshot.val() in a variable for convenience
//     var sv = snapshot.val();

//     // Console.loging the last user's data
//     console.log(sv.favArray);

//     // Change the HTML to reflect
//     $(".fav-drink-section").append(sv.favArray);

//     // Handle the errors
//   }, function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
//   });