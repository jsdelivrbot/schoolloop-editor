
var NAME = "Schoolloop Editor";
var URL = window.location.href.split(/\/+|\./);
var HTTP = URL[0];
if(!URL[4] || URL[4] != "progress_report")
{
	if(!URL[4] || URL[2] != "schoolloop" || URL[3] != "com")
	{
		alert("You must be on schoolloop for "+NAME+" to work")
	}
	else
	{
		alert("You must be on a progress report for "+NAME+" to work");
	}
}

/*
Constant Elements of Schoolloop pages
*/
var pageConstants = 
{
	weightTitle:"Weight",
	weightScoreTitle:"Weight Score"
};

/*
Constants to use in program
*/
var constants = 
{
	weightsCategory:"Category",
	weightsWeight:"Weight",
	assignmentCategory:"Category",
	assignmentName:"name",
	assignmentMaxScore:"maxScore",
	assignmentStudentScore:"studentScore"
};
/*
Functions that extract data from the schoolloop class page HTML

*Requires:
	-

*Function List:
	- getScoresTitles: Retrieves the HTML element of the titles in the box labeled "SCORES PER CATEGORY"
	- getScoresContent: Retrieves the HTML elements of the list under "SCORES PER CATEGORY"
	- getScoresAttrOf: Turns a HTML element of titles into a string array of the titles
	- getScoresAttr: Returns a string array of the scores titles
	- scoresCategoryCollection: Returns an array of objects that use score titles property labels to properties within 
		the table. Essentially turns the data in the scores table into an array of objects
	- getGradeLegendTbl: Retrieves the table containing the grade legend of a students class
	- getGradeLegendCodesOf: Gets the list of grade legend codes from an HTML table of the grade legend
	- getGradeLegendCodes: Gets the list of grade legend codes from the document
	- getAssignmentTbl: Retrieves the table containing the assignments of a student's class
	- getAssignmentCategory: Retrieves the category of an assignment
	- getAssignmentName: Retrieves the name of an assigment
	- getAssignmentScoreMax: Retrieves the max score of an assignment
	- getAssignmentScore: Retrieves the student's score on an assignment
*/
var Retriever = 
{
	/*
	Retrieves the HTML element of the titles in the box labeled "SCORES PER CATEGORY"
	@return {HTMLTableRowElement} attributesRow: The titles for the scores
	*/
	getScoresTitles:function()
	{
		var attributesRow = document.getElementsByClassName("module_content")[0].getElementsByTagName("tr")[0]; 
		return attributesRow;
	},

	/*
	Retrieves the HTML elements of the list under "SCORES PER CATEGORY"
	@return {[]} tbl: The content of the list
	*/
	getScoresContent:function()
	{
		var tbl = document.getElementsByClassName("module_content")[0].getElementsByTagName("tr"); 
		tbl = [...tbl]; 
		tbl.shift(); 
		return tbl;
	},

	/*
	Turns a HTML element of titles into a string array of the titles
	@param tblAttr: HTML element of titles -- return value from getScoresTitles
	@return {[]} attr: Array of strings of score titles
	*/
	getScoresAttrOf:function(tblAttr)
	{
		var attr = [];
		for(var i = 0;i<tblAttr.children.length;i++)
		{
			attr[i] = tblAttr.children[i].innerHTML.replace(":",""); 
		}
		return attr;
	},

	/*
	Returns a string array of the scores titles
	@return {[]}: Array of strings of score titles
	*/
	getScoresAttr:function()
	{
		var tblAttr = this.getScoresTitles();
		return this.getScoresAttrOf(tblAttr);
	},

	/*
	Turns the data in the scores table into an array of objects
	@return {[]} collection: Object array with property labels of the titles and property values of the content
	*/
	scoresCategoryCollection:function()
	{
		var collection = [];
		var scoresTbl = this.getScoresContent();
		var genAttr = this.getScoresAttr();

		for(var i = 0;i<scoresTbl.length;i++)
		{
			collection[i] = new Object();
			var currentRow = scoresTbl[i];

			for(var j = 0;j<currentRow.children.length;j++)
			{
				collection[i][genAttr[j]] = currentRow.children[j].innerHTML;
			}
		}
		return collection;
	},

	/*
	Retrieves the table containing the grade legend of a students class
	@return {HTMLTableElement}: The element containing the grade legend
	*/
	getGradeLegendTbl:function()
	{
		return document.getElementsByClassName("module_content")[2];
	},

	/*
	Gets the list of grade legend codes 
	@param {HTMLTableElement} gradeLegendTbl: An element containing the grade legend -- return of getGradeLegendTbl
	@return {[]} legendCodes: String array containing the codes within the gradeLegend
	*/
	getGradeLegendCodesOf:function(gradeLegendTbl)
	{
		var legendCodes = [];
		var rows = gradeLegendTbl.children[0].children[0].children;
		for (var i = 1;i<rows.length;i++)
		{
			legendCodes[i-1] = rows[i].children[0].innerText.split(":")[0];
		}
		return legendCodes;
	},

	/*
	Gets the list of grade legend codes 
	@return {[]}: String array containing the codes within the gradeLegend -- return of getGradeLegendCodesOf
	*/
	getGradeLegendCodes:function()
	{
		var gradeLegendTbl = this.getGradeLegendTbl();
		return this.getGradeLegendCodesOf(gradeLegendTbl);
	},

	/*
	Retrieves the table containing the assignments of a student's class
	@return {HTMLTableElement} assignments: The element containing the assignments
	*/
	getAssignmentTbl:function()
	{
		var assignments = document.getElementsByClassName("general_body")[0];
		return assignments;
	},

	/*
	Gets the category of an assignment
	@param {HTMLTableRowElement} assignmentRow: A row from the assignments div -- a child of getAssignmentTbl
	@return {String}: A string of the category
	*/
	getAssignmentCategory:function(assignmentRow)
	{
		return assignmentRow.children[0].children[0].innerText.split("\n")[0].trim();
	},

	/*
	Gets the name of an assignment
	@param {HTMLTableRowElement} assignmentRow: A row from the assignments div -- a child of getAssignmentTbl
	@return {String}: A string of the assignment name
	*/
	getAssignmentName:function(assignmentRow)
	{
		return assignmentRow.children[0].children[0].innerText.split("\n")[1].trim();
	},

	/*
	Gets the element holding an assignment name
	@param {HTMLTableRowElement} assignmentRow: A row from the assignments div -- a child of getAssignmentTbl
	@return {HTMLDivElement}: The element holding the assignment name
	*/
	getAssignmentNameElement:function(assignmentRow)
	{
		return assignmentRow.children[0].children[0]
	},

	/*
	Gets the max score of an assignment
	@param {HTMLTableRowElement} assignmentRow: A row from the assignments div -- a child of getAssignmentTbl
	@return {Number}: The max score of an assignment 
	*/
	getAssignmentScoreMax:function(assignmentRow)
	{
		var assignmentScoreStr = assignmentRow.children[3].innerText;
		if(!assignmentScoreStr.split("/")[1] || !assignmentScoreStr.split("/")[1].split(" ")[1])
		{
			return 0;
		}
		return parseFloat(assignmentScoreStr.split("/")[1].split(" ")[1]);
	},

	/*
	Gets the student's score on an assignment
	@param {HTMLTableRowElement} assignmentRow: A row from the assignments div -- a child of getAssignmentTbl
	@return {Number}: The student's score
	*/
	getAssignmentScore:function(assignmentRow)
	{
		if(!parseFloat(assignmentRow.children[3].children[0].innerText.split(" ")[1]))
		{
			return 0;
		}
		return parseFloat(assignmentRow.children[3].children[0].innerText.split(" ")[1]);
	},

	/*
	Creates an array of objects of a student's assignments
	@return {[]} assignmentCollection: An array of objects with the properties of the student's assignments
		-constants.assignmentCategory
		-constants.assignmentName
		-constants.assignmentMaxScore
		-constants.assignmentStudentScore
	*/
	getAssignmentCollection:function()
	{
		var assignmentCollection = [];
		var assignmentTbl = this.getAssignmentTbl();
		for(var i = 0;i<assignmentTbl.children.length;i++)
		{
			assignmentCollection[i] = new Object();
			assignmentCollection[i][constants.assignmentCategory] = this.getAssignmentCategory(assignmentTbl.children[i]).replace("&amp;","&");
			assignmentCollection[i][constants.assignmentName] = this.getAssignmentName(assignmentTbl.children[i]);
			assignmentCollection[i][constants.assignmentMaxScore] = this.getAssignmentScoreMax(assignmentTbl.children[i]);
			assignmentCollection[i][constants.assignmentStudentScore] = this.getAssignmentScore(assignmentTbl.children[i]);
		}
		return assignmentCollection;
	}
};

/*
Functions that manipulate the data from the Retriever object

*Requires:
	- Retriever
	- pageConstants
	- Builder
	- Student Data

*Function List:
	- findTotalWeightOf: Finds the total combined weight of a score category's weight listing
	- findCategoryPointsOf: Combines a student assignment points into the categories 
	- calculateTotalGrade: Calculates a student's total grade
*/
var DataHandling = 
{
	/*
	Returns the total combined weight of a score category's weight listing
	@param {[]} weights: Object array of the score table -- return value from Retriever.scoresCategoryCollection
	@return {Number} totalWeight: The total combined weight of a student's class
	*/
	findTotalWeightOf:function(weights)
	{
		if(!weights || weights.length == 0) //checks for categories
		{
			return -1;
		}
		if(!weights[0][pageConstants.weightTitle]) //checks for weights
		{
			return -1;
		}

		var totalWeight = 0;
		for(var i = 0;i<weights.length;i++)
		{
			totalWeight+=parseFloat(weights[i][pageConstants.weightTitle]);
		}
		return totalWeight;
	},

	/*
	An object to handle Category data
	*/
	Category:function()
	{
		this.weight = 0;
		this.cat = "";
		this.studentPoints = 0;
		this.maxPoints = 0;
	},

	/*
	Returns categories with combined student data
	@param {[]} assignments: Array of student assignment data objects -- return value of Retriever.getAssignmentCollection
	@param {[]} weights: Array of weight data objects -- return value of Retriver.scoresCategoryCollection
	@return {[]}: Array of Category objects with properties
	*/
	findCategoryPointsOf:function(assignments,weights)
	{
		var categoryPoints = [];
		for(var i = 0;i<weights.length;i++)
		{
			categoryPoints[i] = new this.Category();
			if(!weights[i][constants.weightsCategory])
				categoryPoints[i].cat = i+"?";
			else
				categoryPoints[i].cat = weights[i][constants.weightsCategory];

			if(!weights[i][constants.weightsWeight])
				categoryPoints[i].weight = i+"?";
			else
			{
				var currentWeight = parseFloat(weights[i][constants.weightsWeight]);
				if(!currentWeight)
					currentWeight = 0;
				categoryPoints[i].weight = currentWeight;
			}
		}
		for(var i = 0;i<assignments.length;i++)
		{
			var currentCategory = assignments[i][constants.assignmentCategory].replace("&amp;","&");
			var currentStudentPoints = assignments[i][constants.assignmentStudentScore];
			var currentMaxPoints = assignments[i][constants.assignmentMaxScore];
			for(var j = 0;j<categoryPoints.length;j++)
			{
				if(currentCategory == categoryPoints[j].cat)
				{
					categoryPoints[j].maxPoints += currentMaxPoints;
					categoryPoints[j].studentPoints += currentStudentPoints;
				}
			}
		}
		return categoryPoints;
	},

	/*
	Calculates a student's total grade
	@param {StudentData} studentData: The studentData containing the student's scores in the class
	@param {Boolean} retrieveCategories: true - only incorporate user-checked categories;false - include all categories
	@param {Builder} builder: The builder object containing the checkboxes - only required if retrieveCategories is true
	@return {Number} totalGrade: The student's grade percentage in decimal
	*/
	calculateTotalGrade:function(studentData,retrieveCategories,builder)
	{
		var categories = [];
		if(retrieveCategories)
		{
			for(var i = 0;i<builder.categoryChecks.length;i++)
			{
				if(builder.categoryChecks[i].checked)
				{
					var currentCat = builder.categoryChecks[i].id;
					for(var j = 0;j<studentData.categoryPoints.length;j++)
					{
						if(studentData.categoryPoints[i].cat == currentCat)
							categories.push(studentData.categoryPoints[i]);
					}
				}
			}
		}
		else
		{
			for(var i = 0;i<studentData.categoryPoints.length;i++)
			{
				categories.push(studentData.categoryPoints[i]);
			}
		}
		if(categories.length == 0)
		{
			return 0;
		}

		var totalWeight = 0;
		var totalGrade = 0;
		for(var i = 0;i<categories.length;i++)
		{
			if(categories[i].maxPoints == 0)
			{
				if(categories[i].studentPoints == 0)
					continue;
				categories[i].maxPoints = 1;
			}
			totalWeight+=categories[i].weight;
			var catPercent = categories[i].studentPoints/categories[i].maxPoints;
			totalGrade += catPercent * (categories[i].weight/100);
		}
		totalGrade = totalGrade * (1/totalWeight) * 100;
		return totalGrade;
	},

	/*
	Calculates a student's grade per category
	@param {StudentData} studentData: The student's data containing his points per category
	@return {[]} categoryGrades: A 2d object-like array, with the first index representing the place in studentData it
		came from, and the second index containing two pieces of data: 0 - the grade of the category; 1 - the name of 
		the category
	*/
	calculateCategoryGrades:function(studentData)
	{
		var categoryGrades = [];
		for(var i = 0;i<studentData.categoryPoints.length;i++)
		{
			categoryGrades[i] = [];
			if(studentData.categoryPoints[i].maxPoints == 0)
			{
				if(studentData.categoryPoints[i].studentPoints == 0)
					continue;
				studentData.categoryPoints[i].maxPoints = 1;
			}
			categoryGrades[i][0] = studentData.categoryPoints[i].studentPoints/studentData.categoryPoints[i].maxPoints;
			categoryGrades[i][1] = studentData.categoryPoints[i].cat;
		}
		return categoryGrades;
	}
};
/*
Requires:
	- Retriever
	- Data Handler
	- Student Class Data
*/
var Builder = function(studentData)
{
	this.dataRef = studentData;
	this.assignmentTbl = Retriever.getAssignmentTbl();

	this.deleteButtons = [];
	this.realTrashHolder = document.createElement("div");
	this.realTrash = []; //Actual assignments that were deleted
	this.fakeTrashHolder = document.createElement("div");
	this.fakeTrash = []; //Fake assignments that were deleted
	this.contentHolder = document.createElement("div");

	/*
	Holds basic options
	*Options
		- Calculate Grade with different categories
	*/
	this.rightContentDiv = document.body.appendChild(document.createElement("div"));
	this.rightContentDiv.width = 350;
	this.rightContentDiv.style.width = this.rightContentDiv.width+"px";
	this.rightContentDiv.style.position = "fixed";
	this.rightContentDiv.style.left = window.innerWidth-this.rightContentDiv.width+"px";
	this.rightContentDiv.style.top = "0px";
	this.rightContentDiv.style.backgroundColor = "#FAF6DA";
	this.rightContentDiv.style.padding = "5px";
	this.rightContentDiv.style.zIndex = 9999999;

	/*
	Holds building options
	*Options
		- Add assignments to the list
	*/
	this.bottomContentDiv = document.body.appendChild(document.createElement("div"));
	this.bottomContentDiv.width = window.innerWidth;
	this.bottomContentDiv.style.width = this.bottomContentDiv.width + "px";
	this.bottomContentDiv.height = 50;
	var documentScrollOffset = document.createElement("div");
	documentScrollOffset.style.height = this.bottomContentDiv.height + "px";
	document.body.appendChild(documentScrollOffset);
	this.bottomContentDiv.style.height = this.bottomContentDiv.height+"px";
	this.bottomContentDiv.style.position = "fixed";
	this.bottomContentDiv.style.top = window.innerHeight - this.bottomContentDiv.height + "px";
	this.bottomContentDiv.style.left = "0px";
	this.bottomContentDiv.style.padding = "5px";
	this.bottomContentDiv.style.backgroundColor = "#FAF6DA";
	this.bottomContentDiv.style.zIndex = 9999999;


	this.calculateGradeButton = this.rightContentDiv.appendChild(document.createElement("input"));
	this.calculateGradeButton.type = "button";
	this.calculateGradeButton.value = "Calculate my grade with these categories:";
	this.calculateGradeButton.builder = this;

	this.categoryDiv = this.rightContentDiv.appendChild(document.createElement("div"));

	this.categoryChecks = [];
	this.categoryContainers = [];
	this.categoryGrades = [];

	/*
	Adds a category checkbox to the basic options
	@param {String} category: The name of the category
	*/
	this.addCategory = function(category)
	{
		var containerIndex = this.categoryContainers.push(this.rightContentDiv.appendChild(document.createElement("span"))) - 1;

		var checkIndex = this.categoryChecks.push(this.categoryContainers[containerIndex].appendChild(document.createElement("input"))) - 1;

		this.categoryChecks[checkIndex].type = "checkbox";
		this.categoryChecks[checkIndex].id = category; //must be category
		this.categoryChecks[checkIndex].checked = true;

		this.categoryContainers[containerIndex].innerHTML+=category+" - ";

		var gradeIndex = this.categoryGrades.push(document.createElement("span")) - 1;
		this.categoryGrades[gradeIndex] = this.categoryContainers[containerIndex].appendChild(this.categoryGrades[gradeIndex]);
		this.categoryGrades[gradeIndex].innerHTML = "%";
		this.categoryGrades[gradeIndex].id = category+"grade";

		this.categoryContainers[containerIndex].innerHTML+="<br/>";
	};
	for(var i = 0;i<studentData.categoryPoints.length;i++)
	{
		this.addCategory(studentData.categoryPoints[i].cat);
	}

	this.currentGradeDisplay = document.createElement("span");
	this.rightContentDiv.appendChild(this.currentGradeDisplay);
	/*
	Changes the grade presented as the student's total grade
	@param {Number} grade: The new grade
	*/
	this.updateTotalGradeDisplay = function(grade)
	{
		grade = Math.round(grade*10000)/100;
		this.currentGradeDisplay.innerHTML = "Grade: "+grade+"%<br/>";
	};
	this.updateTotalGradeDisplay(DataHandling.calculateTotalGrade(studentData,false));

	/*
	Changes the grade presented next to each category
	@param {[]} categoryGrades: The grades for each category in an array --return of DataHandling.calculateCategoryGrades
	@param {[]} categoryPoints: Array holding Category objects containing the weights of each category
	*/
	this.updateCategoryGradeDisplays = function(categoryGrades,categoryPoints)
	{
		for(var i = 0;i<categoryGrades.length;i++)
		{
			var currentGrade = categoryGrades[i];
			if(!currentGrade[0])
			{
				currentGrade = [];
				currentGrade[0] = 0;
			}
			currentGrade = currentGrade[0];
			currentGrade = Math.round(currentGrade*10000)/100;
			this.categoryGrades[i].innerHTML = categoryPoints[i].weight + "% - " + currentGrade + "%";
		}
	};
	this.updateCategoryGradeDisplays(DataHandling.calculateCategoryGrades(this.dataRef),this.dataRef.categoryPoints);

	/*
	Event function for when user clicks the calculate grade button
	*/
	this.calculateGradeClicked = function()
	{
		var grade = DataHandling.calculateTotalGrade(this.builder.dataRef,true,this.builder);
		this.builder.updateTotalGradeDisplay(grade);
	};
	this.calculateGradeButton.onclick = this.calculateGradeClicked;

	this.newAssignmentDiv = this.bottomContentDiv.appendChild(document.createElement("div"));
	this.newAssignmentDiv.id = "newAssignmentDiv";
	this.newAssignmentDiv.innerHTML += "<b>New Assignment:</b> Category: ";

	this.categorySelection = this.newAssignmentDiv.appendChild(document.createElement("select"));
	var newOption;
	for(var i = 0;i<this.dataRef.categoryPoints.length;i++)
	{
		newOption = document.createElement("option");
		//newOption.value = this.dataRef.categoryPoints[i].cat;
		newOption.text = this.dataRef.categoryPoints[i].cat;
		this.categorySelection.add(newOption);
	}
	this.categorySelection.id = "categorySelection";
	this.categorySelection.builder = this;

	this.newAssignmentDiv.innerHTML += " Assignment Name: ";
	this.newAssignmentNameTextField = this.newAssignmentDiv.appendChild(document.createElement("input"));
	this.newAssignmentNameTextField.type = "text";
	this.newAssignmentNameTextField.id = "newAssignmentNameTextField";
	this.newAssignmentNameTextField.builder = this;

	this.newAssignmentDiv.innerHTML += " Max Score: ";
	this.newAssignmentMaxScoreField = this.newAssignmentDiv.appendChild(document.createElement("input"));
	this.newAssignmentMaxScoreField.type = "number";
	this.newAssignmentMaxScoreField.builder = this;
	this.newAssignmentMaxScoreField.id = "newAssignmentMaxScoreField";

	this.newAssignmentDiv.innerHTML += " Your Projected Score: ";
	this.newAssignmentStudentScoreField = this.newAssignmentDiv.appendChild(document.createElement("input"));
	this.newAssignmentStudentScoreField.type = "number";
	this.newAssignmentStudentScoreField.builder = this;
	this.newAssignmentStudentScoreField.id = "newAssignmentStudentScoreField";

	this.newAssignmentDiv.innerHTML += "  ";
	this.newAssignmentAddButton = this.newAssignmentDiv.appendChild(document.createElement("input"));
	this.newAssignmentAddButton.type = "button";
	this.newAssignmentAddButton.value = "Add";
	this.newAssignmentAddButton.builder = this;
	this.newAssignmentAddButton.id = "newAssignmentAddButton";

	/*
	Adds an assignment to the bottom of a student's assignment table
	@param {String} category: The category of the new assignment
	@param {String} name: The name of the new assignment
	@param {Number} studentScore: The student's projected score on this assignment
	@param {Number} maxScore: The max score possible on this assigment (what it's out of)
	*/
	this.addAssignment = function(category,name,studentScore,maxScore)
	{
		var percent = Math.round((studentScore/maxScore)*10000)/100;
		var newAssignmentRow = document.createElement("tr");
		newAssignmentRow.style.backgroundColor = "#EDF2F8";
		newAssignmentRow.innerHTML = 
			/*
			HTML taken from the schoolloop page
			*/
			'<td><div class="float_l padding_r5" style="min-width: 105px;">'
			+category+
			'<br><a href="" title='
			+name+
			'>'
			+name+
			'</div></td><td style="width:100%;"></td><td>FakeDate<br></td><td nowrap=""><div>Score: '
			+studentScore+
			'</div>'
			+studentScore+
			' / '
			+maxScore+
			' = '
			+percent+
			'%</td><td class="list_text"><div style="width: 125px;"></div></td>';
		this.assignmentTbl.appendChild(newAssignmentRow);
	};
	/*
	Event function for when user clicks to add a new assignment
	*/
	this.addAssignmentButtonClicked = function()
	{
		var category = this.builder.categorySelection.value;
		var name = this.builder.newAssignmentNameTextField.value;
		var studentScore = this.builder.newAssignmentStudentScoreField.value;
		var maxScore = this.builder.newAssignmentMaxScoreField.value;
		this.builder.addAssignment(category,name,studentScore,maxScore);
		this.builder.dataRef.reset();
		this.builder.reset();
	};
	this.newAssignmentAddButton.onclick = this.addAssignmentButtonClicked;

	/*
	Event function for when user clicks to delete an assignment
	*/
	this.deleteButtonClicked = function()
	{
		//reference changes to deleteButton
		this.builder.deleteAssignment(this.rowNumber,this.builder);
		this.builder.dataRef.reset();
		this.builder.reset();
	};
	/*
	Creates a delete button next to each assignment in the table and initializes them
	*/
	this.createDeleteButtons = function()
	{
		//reset delete buttons
		for(var i = 0;i<this.deleteButtons.length;i++)
		{
			this.deleteButtons[i].parentNode.removeChild(this.deleteButtons[i]);
		}
		this.deleteButtons = [];

		for(var i = 0;i<this.assignmentTbl.children.length;i++)
		{
			var currentRow = Retriever.getAssignmentNameElement(this.assignmentTbl.children[i]);

			this.deleteButtons[i] = currentRow.appendChild(document.createElement("input"));
			this.deleteButtons[i].type = "button";
			this.deleteButtons[i].value = "Delete";
			this.deleteButtons[i].rowNumber = i;
			this.deleteButtons[i].builder = this;
			this.deleteButtons[i].onclick = this.deleteButtonClicked;
		}
	};
	this.createDeleteButtons();

	/*
	Helper event function that moves an assignment to the builder's trash for when user clicks delete button
	@param {Number} assignmentNumber: The rowNumber of the assignment to delete (0 = top)
	@param {Builder} builder: The builder reference it is working with
	*/
	this.deleteAssignment = function(assignmentNumber,builder)
	{
		var assignmentRowToDelete = builder.assignmentTbl.children[assignmentNumber];
		builder.realTrash.push(builder.realTrashHolder.appendChild(assignmentRowToDelete));
	};
	/*
	Resets key features of the builder object -- useful for when adding new data
	*/
	this.reset = function()
	{
		this.assignmentTbl = Retriever.getAssignmentTbl();
		/*
		Crude Bug Fix:
		For some reason the program can't edit the elements created when creating the builder object through their 
		reference, so this redefine its references off of the document, and somehow that turns it from non-editable to
		editable
		*/
		this.newAssignmentDiv = document.getElementById(this.newAssignmentDiv.id);
		this.categorySelection = document.getElementById(this.categorySelection.id);


		this.newAssignmentNameTextField = document.getElementById(this.newAssignmentNameTextField.id);
		this.newAssignmentMaxScoreField = document.getElementById(this.newAssignmentMaxScoreField.id);
		this.newAssignmentStudentScoreField = document.getElementById(this.newAssignmentStudentScoreField.id);
		this.newAssignmentAddButton = document.getElementById(this.newAssignmentAddButton.id);

		for(var i = 0;i<this.categoryChecks.length;i++)
		{
			var checked = this.categoryChecks[i].checked;
			this.categoryChecks[i] = document.getElementById(this.categoryChecks[i].id);
			this.categoryChecks[i].checked = checked;
		}
		for(var i = 0;i<this.categoryGrades.length;i++)
		{
			this.categoryGrades[i] = document.getElementById(this.categoryGrades[i].id);
		}

		this.updateTotalGradeDisplay(DataHandling.calculateTotalGrade(this.dataRef,true,this));
		this.updateCategoryGradeDisplays(DataHandling.calculateCategoryGrades(this.dataRef),this.dataRef.categoryPoints);
		this.createDeleteButtons();
	};
};
/*
*Requires:
	- Retriever
	- DataHandling
	- pageConstants
*/
var StudentClassData = function()
{
	this.weights = Retriever.scoresCategoryCollection();
	this.assignments = Retriever.getAssignmentCollection();
	this.categoryPoints = DataHandling.findCategoryPointsOf(this.assignments,this.weights);
	this.totalWeight = DataHandling.findTotalWeightOf(this.weights);
	this.reset = function()
	{
		this.weights = Retriever.scoresCategoryCollection();
		this.assignments = Retriever.getAssignmentCollection();
		this.categoryPoints = DataHandling.findCategoryPointsOf(this.assignments,this.weights);
		this.totalWeight = DataHandling.findTotalWeightOf(this.weights);
	};
};
var studentData = new StudentClassData();
var builder = new Builder(studentData);
builder.reset();
