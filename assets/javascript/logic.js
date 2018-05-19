$(document).ready(function() 
{
	function MainProgram()
	{
		
		var config = {};		// Initialize Firebase
		var database;			// Variable to reference the database

		config = 
		{
            apiKey: "AIzaSyBX0zvXtAkO46uoMCK-dc7yMgLh_L3zvgk",
            authDomain: "traintime-5dad7.firebaseapp.com",
            databaseURL: "https://traintime-5dad7.firebaseio.com/",
            projectId: "traintime-5dad7",
            storageBucket: "traintime-5dad7.appspot.com",
            messagingSenderId: "872039472607"
		};

		firebase.initializeApp(config);

		database = firebase.database();

		$("#train-submit").click(function(event)
		{
			event.preventDefault();

			var name;			// Name of the train
			var destination;	// Place the train is traveling to
			var arrivalTime;	// Time the train arrives at the station
			var frequency;		// Frequency of the trains departures

			// Intializes variables
			name = $("#train-name").val().trim();
			destination = $("#train-destination").val().trim();
			arrivalTime = $("#train-time").val().trim();
			frequency = $("#train-frequency").val().trim();

			//Checks the fields for valid entrys
			if(name === '' || destination === '' || arrivalTime === ''
			   || frequency === '')
			{
				alert("Please type a valid entry into each field.");
			}
			else
			{
				database.ref("/trainInfo").push(
				{
		            trainName: name,
		            trainDestination: destination,
		            arrivalTime: arrivalTime,
		            trainFrequency: frequency
	       		});
			}

			$("#train-name").val("");
			$("#train-destination").val("");
			$("#train-time").val("");
			$("#train-frequency").val("");

		});

		database.ref("/trainInfo").on("child_added", function(snapshot)
		{
			UpdateHtml(snapshot.val().trainName, snapshot.val().trainDestination, snapshot.val().trainFrequency,
					   snapshot.val().arrivalTime);
		});

	}

		function UpdateHtml(name, destination, frequency, arrivalTime)
    {
        var row;
        var train;
        var tDestination;
        var tFrequency;
        var tArrival;
        var tMinsAway;
        var nextArrival;
        var minsAway;

        nextArrival = CalcNextArrival(arrivalTime, frequency);
        tMinsAway = CalcMinsAway(nextArrival);
        row = $("<tr>");
        train = $("<td>").text(name);
        tDestination = $("<td>").text(destination);
        tFrequency = $("<td>").text(frequency);
        tArrival = $("<td>").text(nextArrival);
        minsAway = $("<td>").text(tMinsAway);

        row.append(train);
        row.append(tDestination);
        row.append(tFrequency);
        row.append(minsAway);
        row.append(tArrival)
        $("#train-info-section").append(row);
    }
	

	function CalcNextArrival(arrivalTime, frequency)
	{
		var firstTimeConverted;
		var currentTime;
		var diffTime;
		var tRemainder;
		var tMinutesTillTrain;
		var nextTrain;

		firstTimeConverted = moment(arrivalTime, "hh:mm").subtract(1, "years");
		currentTime = moment();
		diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		tRemainder = diffTime % frequency;
		tMinutesTillTrain = frequency - tRemainder;

		return tMinutesTillTrain;
	}

	function CalcMinsAway(tMinutesTillTrain)
	{
		var minsAway;

		minsAway = moment().add(tMinutesTillTrain, "minutes");
		moment(minsAway).format("hh:mm");

		return minsAway;
	}



	MainProgram();


});