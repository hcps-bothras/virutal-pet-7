var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feedTime;

var feed;
var lastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addFeedTheDog = createButton("Feed The Dog");
  addFeedTheDog.position(680,95);
  addFeedTheDog.mousePressed();

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46,139,87);
  foodObj.display();

  feedTime = database.ref("FeedTime")
  feedTime.on("value", function(data){
    lastFed = data.val();
  })
  
  if (lastFed >= 12){
    text("lastFed = PM")
  }
  else if (lastFed === 0){
    text("12 AM")
  }
  else {
    text("lastFed = AM")
  }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val * 0);
  }  else{
    foodObj.updateFoodStock(food_stock_val - 1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
