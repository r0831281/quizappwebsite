const Stats = function(){

	const init = async function() {
		_totalGamesPlayed();
		_lastThreeGames();
		_countDifficulty();

	};

	let _lastThreeGames = function(){
		let openReq = window.indexedDB.open("dataBase");
			openReq.onsuccess = function (event) {
				let db = event.target.result;
		    	let objectStore = db.transaction("scores").objectStore("scores");
		    	objectStore.openCursor().onsuccess = (event) => {
		    	  const cursor = event.target.result;
		    	  console.log(cursor.key)
				  if (cursor && cursor.key <= 3) {
				    console.log(`value for ${cursor.key} is ${cursor.value.score}`);
				    $('#lastGames').append('<li><h4>'+cursor.value.score+'</h4></li>');
				    cursor.continue();
				  }
				  else {
				    console.log("No more entries!");
				  }

		   		};
		    	objectStore.onerror = function (event) {
		        console.log("Operation failed");
		    	};
		    };
		openReq.onerror = function (event) {
		console.log("Operation failed");
		}	
	}

	let _totalGamesPlayed = function() {
			let openReq = window.indexedDB.open("dataBase");
			openReq.onsuccess = function (event) {
				let db = event.target.result;
		    	let countReq = db.transaction("scores", "readonly").objectStore("scores").count();
		    		countReq.onsuccess = function (event) {
		        	console.log("Operation completed successfully"+ countReq);
		        	$('#totalGameStat').html('<h4>'+countReq.result+'</h4>');
		   		};
		    	countReq.onerror = function (event) {
		        console.log("Operation failed");
		    	};
			}
		openReq.onerror = function (event) {
		console.log("Operation failed");
		}	

	}

	let _countDifficulty = function(){
			let openReq = window.indexedDB.open("dataBase");
			openReq.onsuccess = function (event) {
				let db = event.target.result;
				//keyranges for each difficulty
				let keyRangeValueEasy = IDBKeyRange.only("easy");
				let keyRangeValueMedium = IDBKeyRange.only("medium");
				let keyRangeValueHard = IDBKeyRange.only("hard");

				let transaction = db.transaction('scores', 'readonly');
				let objectStore = transaction.objectStore('scores');
				//set index to difficulty keys
				let index = objectStore.index('difficulty');
				//count amount in key range

				let countEasy = index.count(keyRangeValueEasy);
				countEasy.onsuccess = function() {
				  console.log("count easy " + countEasy.result);
				  $('#mostPlayedDifficulty').append("<li><h4> Easy Games Played: "+ countEasy.result +"</h4></li>");
				}

				let countMedium = index.count(keyRangeValueMedium);
				countMedium.onsuccess = function() {
				  console.log("count medium " + countMedium.result);
				  $('#mostPlayedDifficulty').append("<li><h4> Medium Games Played: "+ countMedium.result +"</h4></li>");
				}

				let countHard = index.count(keyRangeValueHard);
				countHard.onsuccess = function() {
				  console.log("count hard " + countHard.result);
				  $('#mostPlayedDifficulty').append("<li><h4> Hard Games Played: "+ countHard.result +"</h4></li>");

				}

			}

	}


	return {init: init};
}();