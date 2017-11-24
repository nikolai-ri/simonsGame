$(document).ready(function(){

  		$(".container").width(window.innerWidth);
  		$(".container").height(window.innerHeight);

  		// The computer safes a random number, corresponding to a field, in here every turn and plays the whole sequence using this array.
  		var randomArray = [];

  		// During players turn clicked values are saved here and later compared with the randomArray.
  		var clickedArray = [];


  		// This array is used as to know if there are any pending audio files or animations. New ones are only started if the array is of length zero. 
  		var stackArray = [];


  		var sequenceLength = 1;

  		var greenField = $("#greenField");
  		var redField = $("#redField");
  		var blueField = $("#blueField");
  		var yellowField = $("#yellowField");

  		var fieldArray = [greenField, redField, blueField, yellowField];


  		var greenFieldAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
  		var redFieldAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
  		var blueFieldAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
  		var yellowFieldAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');

  		var audioArray = [greenFieldAudio, redFieldAudio, blueFieldAudio, yellowFieldAudio];
  		var playIntervall = 500;

  		var playersTurn = false;
  		var gameRunning = false;

  		var strictMode = false;

  		$("#strictWrapper").on('click', function(){
  			if(strictMode === false){
  				$("#toggleStrictMode").addClass("justify-content-end");
  				$("#strictModeBlock").css("background-color", "red");
  				strictMode = true;
  			}
  			else{
  				$("#toggleStrictMode").removeClass("justify-content-end");
  				$("#strictModeBlock").css("background-color", "green");
  				strictMode = false;
  			}
  			

  		});

  		function innerClickHandler(num){
  				if(clickedArray.length === 0 && randomArray.length === 0){
	  				$(".container").toggle("shake");
	  			}
	  			else if(playersTurn){
	  				playersTurn = false;
	  				clickedArray.push(num);
	  				audioArray[num].play();
	  				fieldArray[num].addClass("animationClass", 400, "swing", function(){
	  					fieldArray[num].removeClass("animationClass");
	  				});
	  				setTimeout(function(){playersTurn = true;}, audioArray[num].duration * 1000);
	  				checkTurn();
	  			}
  		}
  		greenField.on('click', function(){
  			
	  		innerClickHandler(0);
  		

  		});
  		redField.on('click', function(){

  			innerClickHandler(1);
  			
  		});
  		blueField.on('click', function(){
  		
  			innerClickHandler(2);
  			

  		});
  		yellowField.on('click', function(){

	  		innerClickHandler(3);

  		});

  		$("#startGame").on('click', function(){
  			randomArray = [];
  			clickedArray = [];
  			sequenceLength = 1;
  			firstStep();
  			gameRunning = true;
  		});

  		function firstStep(num){
  			randomArray = createStep(randomArray, num);
	  		playSequence(randomArray);
	  		playersTurn = true;
  		}

  		function checkTurn(){
  			if(clickedArray.length === randomArray.length){
  				if(checkClickedArray(clickedArray, randomArray)){
  					takeNextStep();
  				}
  				else if(!strictMode){
  					tryAgain();
  					repeatSequence();
  				}
  				else{
  					gameOver();
  				}
  			}
  			else{
  				if(clickedArray[clickedArray.length - 1] !== randomArray[clickedArray.length - 1]){
  					if(!strictMode){
	  					tryAgain();
	  					repeatSequence();
	  				}
	  				else{
	  					gameOver();
	  				}
  				};
  			}
  			
  		}
  		function takeNextStep(){
			setTimeout(function(){
	  			randomArray = createStep(randomArray);
				playSequence(randomArray);
				clickedArray = [];
	  			
  			}, 600);
  		}

  		function repeatSequence(){
  			setTimeout(function(){
				playSequence(randomArray);
				clickedArray = [];
	  	
  			}, 600);
  		}

  		function gameOver(){

  			for(var i = 0; i < fieldArray.length; i++){

  				fieldArray[i].addClass("gameOverClass", 800, "swing", function(){
  					fieldArray[0].removeClass("gameOverClass");
  					fieldArray[1].removeClass("gameOverClass");
  					fieldArray[2].removeClass("gameOverClass");
  					fieldArray[3].removeClass("gameOverClass");
  				})

  			}
  			
  			gameRunning = false;
  			randomArray = [];
		  	clickedArray = [];
		  	sequenceLength = 1;
		  	$("#counts").html(1);
  		}

  		function tryAgain(){

  			for(var i = 0; i < fieldArray.length; i++){

  				fieldArray[i].addClass("animationClass", 500, "swing", function(){
  					fieldArray[0].removeClass("animationClass");
  					fieldArray[1].removeClass("animationClass");
  					fieldArray[2].removeClass("animationClass");
  					fieldArray[3].removeClass("animationClass");
  				})

  			}
  			
  		}

  		function createStep(randomArray, num){
  			if(randomArray.length === 0){
  				randomArray.push(Math.floor(Math.random() * 4));
  				$("#counts").html(1);
  			}
  			else{
  				$("#counts").html(randomArray.length + 1);
  				if(randomArray.length === 20){
  					alert("Oh my you have beaten the game using mainly the tip of your finger!");
  					tryAgain();
  					gameRunning = false;
  					randomArray = [];
		  			clickedArray = [];
		  			sequenceLength = 1;
		  			$("#counts").html(1);
  				}
  				randomArray.push(Math.floor(Math.random() * 4));
  			}
  			return randomArray;
  		}

  		function callBack(i, randomArray){
  			if (i === randomArray.length) return;

			function startPlayback(target){
				  var t = $(target);
				  if(t.length != 1 || !t.is('audio, video')) return undefined; //These are invalid cases
				  var deferred = new $.Deferred();
				  t.on('ended', function(){ deferred.resolve(t) })
				  t[0].play()
				  fieldArray[randomArray[i]].addClass("animationClass", target.duration * 1000, "swing", function(){
				  		fieldArray[randomArray[i]].removeClass("animationClass");
				  });
				  return deferred.promise()
		    }
			startPlayback(audioArray[randomArray[i]]).then(function(){
										if(i !== randomArray.length){
							    			playersTurn = true;
						    			}
										}).then(function(){
											
											callBack(i + 1, randomArray);
										});
  		}


  		function playSequence(randomArray){
  			var index = 0;
  			callBack(index, randomArray);
  		};


  		function checkClickedArray(arr1, arr2){
  			    if(arr1.length !== arr2.length)
			        return false;
			    for(var i = arr1.length; i--;) {
			        if(arr1[i] !== arr2[i])
			            return false;
			    }
			    return true;
  		}

  	});