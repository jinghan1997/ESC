﻿//Before you start running this script

//1. draw your boundaries
//2. select the boundaries
//3. run this script

//TODO change the path to the illustrator file you're using
var myDoc= app.open(File("C:/Users/ymf_m/Desktop/test.ai"));
$.writeln('Demonstration of user interaction with the file');


var array = [[],[]];

var docSel = myDoc.selection;

userBoundary(array);
//AddToArrayStudents(array);
conditionTestAddToArrayStudents (array);
checkAndDrawBoxes (array);

//name the boundaries
//takes in the empty array
//append each boundary into array[0]
function userBoundary(array) {
    
    //retrieve selection length
    var selectionLength = selection.length;
    var inputs = [];
    var tempNames = [];
    
    //use a for loop to create a sequence of objects with their top left coordinates saved 
    for(var i = 0; i < selectionLength; i++){
        var selectionX = selection[i].geometricBounds[0]; //0 in array is top left X
        var selectionY = selection[i].geometricBounds[1]; //1 in array is top left Y
        var selectionWidth = selection[i].width;
        var selectionHeight = selection[i].height;
        var selectionTop = selection[i].top;
        $.writeln('User drawn Top: ', selection[i].top)
        var selectionLeft = selection[i].left;
        
        var currentObj = { 
            name: 'defaultName',
            TopLeftX: selectionX,
            TopLeftY: selectionY,
            width: selectionWidth,
            height: selectionHeight,
            top: selectionTop,
            left: selectionLeft
            };
        inputs.push(currentObj);
        }
    // INPUTS IS A LIST OF currentObj. currentObj is an object with name, TopLeftX, TopLeftY, width, height, top, left
    
    //create window to prompt for user input of boundary names
    var userInput = new Window("dialog", 'Name your boundaries');
    
    //use a for loop to create the fields in the window
    for (var j = 0; j < inputs.length; j++){

        //if the object has a field called name
        if(inputs[j].name != null){
            var inputGroup = userInput.add("group");
            inputGroup.alignment = "left";
            
            //display formatting
            inputGroup.add("statictext", undefined, 'Shape at top left X of '+inputs[j].TopLeftX+
            ' and top left Y of '+inputs[j].TopLeftY+':');
           
            //retrieve values from the array and display in the window
            //need to correct the alignment of the boxes
            tempNames[j] = inputGroup.add("edittext", undefined, inputs[j].name);
            }
        }
    var submitGroup = userInput.add("group");
    submitGroup.alignment = "right";
    
    var submit = submitGroup.add("button", undefined, 'OK');
    var cancel = submitGroup.add("button", undefined, 'Cancel');
    
    submit.active = true;
    
    if(userInput.show() == 1){
        
        for(var j = 0; j < inputs.length; j++){

            //if there is a non-null value in the text box, save that value into currentObj[j]
            if(tempNames[j].text != null){
                inputs[j].name = tempNames[j].text;
                $.writeln('new name');
                $.writeln(inputs[j].name.toSource());
                }
            }
        }

    userInput.show();
    
    //when inputs are finalised
    //append all to the original array[0]
    for(var k = 0; k < inputs.length; k++){
        array[0].push(inputs[k]);
        
    }
}

//creating the student exhibition objects
//takes in the empty array
//append objects (strings) into array[1]
function conditionTestAddToArrayStudents(array){  
    
    var teamIDValue = 2020001;
    var prototype = ["software", "hardware"];
    
    //testing 4 possibilities of the 2 if conditions: true-false, false-true, false-false, true-true
    // only the true-true (2020004) will appear
    var arrayWidth = [2000,10,500,73];
    var arrayLength = [20,467,650,32];
    var length =4;
    
    for(var i =0; i < length; i++){
        var obj = {};
        // obj is an object with attributes: teamID, prototype (software/hardware), length, width, fixed.
        obj["teamID"] = teamIDValue + i;
        var value = obj["teamID"] % 2
        obj["prototype"] = prototype[value];
        obj["length"] = arrayLength[i];
        obj["width"] = arrayWidth[i];
        obj["fixed"] = false;
        
//~         var groupItem = myDoc.groupItems.add();
//~         
//~         var rectangle = groupItem.pathItems;
//~         rectangle.rectangle(200,200,arrayLength[i],arrayWidth[i]);
//~         rectangle.stroke = true;
//~         var text = groupItem.textFrames.add();
//~         text.contents = obj["teamID"];
//~         text.position = Array(200,212);
//~         text.textRange.size = 8;
//~         
//~         obj["grouped"] = groupItem;
//~         obj["grouped"].name = obj["teamID"]
        array[1].push(obj);
        }
    }

//What is created: 
//rectangles with the corresponding teamID in the same group item
//the names of the groupItem is the same as their teamID
//YOU CAN REFER THEM AS
//myDoc.groupItems.getByName("2020002")
function checkAndDrawBoxes(bigArray){
    var userDrawnBoxes = bigArray[0];
    var projectDimensions = bigArray[1];
    var artLayer = myDoc.layers.add();
    
    $.writeln('Size of userDrawBoxes is: ', userDrawnBoxes.length)
    
    for(var i = 0; i < projectDimensions.length; i++){
        for(var j = 0; j < userDrawnBoxes.length; j++){
            if(projectDimensions[i].length <= userDrawnBoxes[j].height && projectDimensions[i].width <= userDrawnBoxes[j].width){
                // dimension of user stored as: top, left, width, length
                // draw rectangle that has width = csv[width] and height = csv[height] at user[j][top] and user[j][left]
                // user[top] - csv[height] and user[length] - csv[length]
                // draw textBox to name project[i]
                var projGroup = artLayer.groupItems.add();
                
                // debugging
                $.writeln('User drawn Height: ', userDrawnBoxes[j].height)
                $.writeln('User drawn width: ', userDrawnBoxes[j].width)
                $.writeln('Project dimensions width: ', projectDimensions[i].width)
                $.writeln('Project dimensions length: ', projectDimensions[i].length)
                $.writeln('User drawn left: ', userDrawnBoxes[j].left)
                
                var newRect = projGroup.pathItems.rectangle(userDrawnBoxes[j].top, userDrawnBoxes[j].left, projectDimensions[i].width, projectDimensions[i].length);
                
                var noColour = new NoColor();
                newRect.fillColor = noColour;
                var redColour = new RGBColor();
                redColour.red = 255;
                newRect.strokeColor = redColour;
                redraw();
                
                var projNumber = projectDimensions[i].teamID;
                var projTextFrame = projGroup.textFrames.add();
                projTextFrame.top = userDrawnBoxes[j].top;
                projTextFrame.left = userDrawnBoxes[j].left;
                projTextFrame.contents = projNumber;
                
                projectDimensions[i].fixed = true;
                
                // create a new box based on the value of the old box - drawn box
                var selectionWidth = userDrawnBoxes[j].width;
                var selectionHeight = userDrawnBoxes[j].height - projectDimensions[i].length;
                var selectionTop = userDrawnBoxes[j].top - projectDimensions[i].length;
                var selectionLeft = userDrawnBoxes[j].left;
                var selectionX = userDrawnBoxes[j].TopLeftX + projectDimensions[i].width;
                var selectionY = userDrawnBoxes[j].TopLeftY;
                var currentObj = { 
                    name: 'newBox',
                    TopLeftX: selectionX,
                    TopLeftY: selectionY,
                    width: selectionWidth,
                    height: selectionHeight,
                    top: selectionTop,
                    left: selectionLeft
                    };
                userDrawnBoxes.push(currentObj);
                
                // change the value of the old box to be the height of the drawn box
                userDrawnBoxes[j].height = projectDimensions[i].length;
                userDrawnBoxes[j].left += projectDimensions[i].width;
                userDrawnBoxes[j].width -= projectDimensions[i].width;
                
                //var new_array = [];
                //for(var p = 0; p < j; p++){
                    //new_array.push(userDrawnBoxes[p]);
                    //}
                //new_array.push(currentObj);
                //for(var k = j+1; k < userDrawnBoxes.length; k++){
                    //new_array.push(userDrawnBoxes[k]);
                    //}
                
                //for(var l = 0; l < new_array.length; l++){
                    //userDrawnBoxes[l] = new_array[l];
                    //}
                
                break; // after we assign already should break out so we don't repeat assignments
            }
        }
    }
    $.writeln(userDrawnBoxes.length);
    $.writeln(bigArray[0].length);
}    








//you can reference each student rectangle as following (just change the argument for getByName)
//.translate(+x distance, +y distance)
//myDoc.groupItems.getByName("2020002").translate(200,0);




/*
//if you want to check the rotation of a drawn object on the screen via selection

//reads the item you have selected
var docSelection = myDoc.selection;

//gets the angle of rotation from last thing you drew on the screen 
//tag[0] referring to "BBAngleAccum" which records angle in radians
var rotationb = (180 * (docSelection[0].tags[0].value / Math.PI));
$.writeln("check bounds");
$.writeln(rotationb.toSource());

*/