
const Game = function () {
	let questionUrl = "";
	let questionAmountSetting = 0;
	let difficultySetting = "";
	let gameScore = 0;
	let categoryArray = {'General Knowledge':0,
						'Entertainment: Books':0,
						'Entertainment: Film':0,
						'Entertainment: Music':0,
						'Entertainment: Musicals & Theatres':0,
						'Entertainment: Television':0,
						'Entertainment: Video Games':0,
						'Entertainment: Board Games':0,
						'Science & Nature':0,
						'Science: Computers':0,
						'Science: Mathematics':0,
						'Mythology':0,
						'Sports':0,
						'Geography':0,
						'History':0,
						'Politics':0,
						'Art':0,
						'Celebrities':0,
						'Animals':0,
						'Vehicles':0,
						'Entertainment: Comics':0,
						'Science: Gadgets':0,
						'Entertainment: Japanese Anime & Manga':0,
						'Entertainment: Cartoon & Animations':0
						};

	const init = async function(questionAmount, difficulty){
		$('.questionResult').hide();
		$('#loadingQuestions').show();
		$('.endOfGame').empty();
		$('.currentQuestion').empty();
		_setQuestionAmount($('#questionAmountSetting').val());
		_setDifficulty($('.difficultySetting').filter(':selected').val());
		console.log($('.difficultySetting').filter(':selected').val());
		_makeQuestionUrl();
		_makeQuestionArray();
		startGame();
		console.log(questionUrl);

	};

	const _setDifficulty = function(){
		difficultySetting = $('.difficultySetting').filter(':selected').val();
		return difficultySetting;
	};

	const _setQuestionAmount = function(questionAmount){
		questionAmountSetting = questionAmount;
		return questionAmountSetting;
	};

	const _getQuestionAmount = function(){
		return this.questionAmountSetting;
	};

	const _makeQuestionUrl = function(questionAmount){
		questionUrl = "https://opentdb.com/api.php?amount="+questionAmountSetting+"&type=multiple"+"&difficulty="+difficultySetting;
	};

	const _makeQuestionArray = function(){
		    return new Promise((resolve,reject)=>{
	        	$.getJSON( questionUrl , function( data ) {
			  		$.each( data.results, function( key, val ) {
			  			localStorage.setItem(key+1, JSON.stringify(val));
			  		});
				});
        setTimeout(()=>{
            console.log("loading questions in localStorage");
            resolve();
        ;} , 1500
        );
    });

	};

	const _deleteQuestionArray = function(){
		let key = questionAmountSetting;
		while (key>=0){
			localStorage.removeItem(key);
			key = key-1;
		};
	};

	const getItem = function(id){
		let item = JSON.parse(localStorage.getItem(id));
		return item;
	};

	const _appendQuestion = function(id){
		$('.card').hide();
		$('h3').hide();
		let currentQuestion = getItem(id);
		let questionWithId = '<h3 id="'+id+'">'+currentQuestion['question']+'</h3>';
		$('#loadingQuestions').hide();
		$('.currentQuestion').html(questionWithId);

	};

	const _setAnswers = function(id){
		$('.card').hide();
		let answerButtons = $('.answer').toArray();
		$(answerButtons).text(" ").html(" ");
		let currentAnswers = getItem(id);
		let currentCorrectAnswer = currentAnswers['correct_answer'];
		let currentIncorrectAnswers = currentAnswers['incorrect_answers'];
		let randomButton = answerButtons.splice(Math.floor(Math.random()*answerButtons.length), 1);
		$(randomButton).val(currentCorrectAnswer).html(currentCorrectAnswer);
		let i = 0;
		$(answerButtons).each(function(){$(this).val(currentIncorrectAnswers[i]).text(currentIncorrectAnswers[i]); i += 1;})
		$('.card').show();
		console.log(randomButton);
		console.log(answerButtons);
		console.log(currentCorrectAnswer);
		console.log(currentIncorrectAnswers)

	};



	const _checkAnswer = function(answer, id){
		let currentAnswersForCheck = getItem(id);
		$('.questionResult').hide()
		console.log(currentAnswersForCheck)
	 	let currentCorrectAnswerForCheck = currentAnswersForCheck['correct_answer'];
		console.log(currentCorrectAnswerForCheck+" in check");
		if(answer == currentCorrectAnswerForCheck){
			$('#correctAnswer').fadeTo(1000,1).fadeOut(2500);
			gameScore += 1;
			let questionCategory = currentAnswersForCheck['category'];
			categoryArray[questionCategory] += 1;
			console.log(questionCategory + categoryArray[questionCategory])

			console.log(gameScore)
			$('#scoreBadge').html(gameScore+"/"+questionAmountSetting);
			return true;
		}else{
			$('#falseAnswer').fadeTo(1000,1).fadeOut(2500);
			return false;
		}

	};

	const gameEnd = function(){
		$('.card').hide();
		const endMsg = "<h1>Game End</h1>"+"<br><h2>your score was</h2>"+"<h2>"+gameScore+"/"+questionAmountSetting+"</h2>";
		$('.endOfGame').html(endMsg);
		$('.answer').empty();
		gameLength = 0;
		currentCorrectAnswerForCheck = "";
		localStorage.clear();

		//put game results in db

		//open db request
		let openReq = window.indexedDB.open("dataBase");
		openReq.onupgradeneeded = function (event) {
		    var db = event.target.result;
		    let scoreStore = db.createObjectStore("scores", {autoIncrement: true});
		    scoreStore.createIndex('difficulty', 'difficulty', {unique: false});
		    scoreStore.createIndex('score', 'score', {unique: false});
		    console.log("created")
		};
		openReq.onsuccess = function (event) {
		    var db = event.target.result,
		        item = {
		            score: gameScore+"/"+questionAmountSetting,
		            difficulty: difficultySetting,
		            added_on: new Date()
		        };
	    	var addReq = db.transaction("scores", "readwrite").objectStore("scores").add(item);
	    		addReq.onsuccess = function (event) {
	        	console.log("Operation completed successfully");
	   		};
	    	addReq.onerror = function (event) {
	        console.log("Operation failed");
	    	};
		}
		openReq.onerror = function (event) {
    	console.log("Operation failed");
		}
		return null;

	}



	const startGame = async function(){
		gameLength = questionAmountSetting;
		console.log(questionAmountSetting);
		await _makeQuestionArray();
		_appendQuestion(gameLength);
		_setAnswers(gameLength);
		$('.answer').click(function(){
			let currentAnswer = $(this).val();
			console.log(currentAnswer);
			console.log(gameLength);
			let check = _checkAnswer(currentAnswer, gameLength);
			console.log(check);
			if (check == true  && gameLength>1){
				console.log('you gave correct answer');
				gameLength-=1;
				_appendQuestion(gameLength);
				_setAnswers(gameLength);
				}
			else if (check == false && gameLength>1){
				console.log('false answer');
				gameLength-=1;
				_appendQuestion(gameLength);
				_setAnswers(gameLength);
			}
			else{
				_deleteQuestionArray();
				gameEnd();

			}
			});

	};



	return {
		init: init,
		gameEnd: gameEnd
	};


}();