/****************************************
Name: Brandon Brien
ID: 10079883

TODO: 
	- Count for each color. (could be month, week, year...not sure yet)




*****************************************/

var xScale = d3.scale.linear().range([0, width]);
var yScale = d3.scale.linear().range([height, 0]);


var barChartSetup = false;
var svg2;
var width = 960,
    height = 150,
    cellSize = 17, // cell size
    week_days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
	para_choices = ['Calories Burned', 'Steps', 'Distance', 'Floors', 'Minutes Sedentary', 'Minutes Lightly Active', 'Minutes Fairly Active'
					, 'Minutes Very Active', 'Activity Calories', 'Minutes Asleep', 'Minutes Awake', 'Number of Awakenings', 'Time in Bed'],
	color_choices = ["#4292c6", "#74c476", "#74c476", "#fd8d3c", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#de2d26", "#df65b0", "#66c2a4", "#969696", "#969696"],
	vetoNames = [],
	checkBox_ids = ["user1_box", "user2_box", "user3_box", "user4_box", "user5_box", "user6_box", "user7_box", "user8_box", "user9_box", 
					"user10_box", "user11_box", "user12_box", "user13_box", "user14_box", "user15_box", "user16_box", "user17_box", "user18_box", "user19_box", "user20_box"],
	usernames = ["User 1", "User 2", "User 3", "User 4", "User 5", "User 6", "User 7", "User 8", "User 9", "User 10", "User 11", "User 12", "User 13", "User 14", "Benny", 
				"Allison", "Debbe", "Lester", "Carina", "Brandon"]
	maxValuesBar = [7000, 31000, 17, 200, 1500, 800, 220, 250, 6500, 680, 250, 50, 1000],
	maxDomains = [4143, 15000, 9.135, 36.17, 1436, 289, 124, 62, 2188, 484, 44.67, 24.00, 516],
	index1_colors = [ ["#c6dbef", "#9ecae1" , "#6baed6","#3182bd", "#08519c"], 
							["#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
							["#c7e9c0", "#a1d99b", "#74c476", "#31a354", "#006d2c"],
							["#feedde", "#fdbe85", "#fd8d3c", "#e6550d", "#a63603"],
							["#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d",],
							["#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d",],
							["#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d",],
							["#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d",],
							["#fee5d9","#fcae91","#fb6a4a","#de2d26","#a50f15"],
							["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"],
							["#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"],
							["#d9d9d9","#cccccc","#969696","#636363","#252525"],
							["#d9d9d9","#cccccc","#969696","#636363","#252525"]
							],
	color = null,
	barChartIndex = 0,
	barChartDate = null,
	parameter_choice = 0;
	
// Format for the date
var percent = d3.format(".1%"),
    //format = d3.time.format("%m/%d/%Y");
    format = d3.time.format("%Y-%m-%d");

// Initial state of the diagram (calories burned)
change_color_domain(4143);

// Changes the color-scale domain when the parameter changes	
function change_color_domain(new_max)
{
	var r_ange =5;
	
	//Special range for active minutes selection
	if(barChartIndex == 4 || barChartIndex == 5 || barChartIndex == 6  || barChartIndex == 7)
	{
		r_ange = 7;
	}
	color = d3.scale.quantize()
		//.domain([-.05, .05])
		.domain([0, new_max])
		.range(d3.range(r_ange).map(function(d) { 
		
			
			var temp = parameter_choice;
			if (parameter_choice === 0)
			{
				temp = 13;
			}
			return "q" + d + "-" + temp; 
		}
		));
}



// Sets up the body 
var svg = d3.select("body").selectAll("svg")
    .data(d3.range(2014, 2017))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
	.style("display", "block")
	.style("margin", "auto")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 50) / 2) + "," + (height - cellSize * 7 - 1) + ")");

// Text to show the year
svg.append("text")
    .attr("transform", "translate(-40," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });

// Sets up the day/tile for each day
var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })	
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
	
	.on("click", function() {
		barChartDate = d3.select(this).select("title").text();
		barChartDate = barChartDate.split(" ", 1)[0];
		loadBarChart();})
	.on("mouseover", function() {
		d3.select(this).style("box-shadow", "box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19)");
		})
    .datum(format);

// Append a title for mouse over on each block1
rect.append("title")
    .text(function(d) { return d; });

// Setting up the month so that we can have month paths
svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath)
	

// Create buttons and choics menus
createButtons();
build_user_menu();
window.onload = build_legend;
	
// Initally start with the first option on the menu (calories burned) 
update_vis_data(0);

// Handles the parameter changes and updates the visualization and data fixing
function update_vis_data (to_show) {

	d3.csv("All_data.csv", function(error, csv) {
	  if (error) throw error;
		//console.log(csv);
		
		//Filters the non-checked names from csv
		
		//console.log(vetoNames);
		for(i=0;i<csv.length;i++)
		{
			for(j=0;j<vetoNames.length;j++)
			{
				if(csv[i]["Name"] === vetoNames[j])
				{
					csv.splice(i,1);
					i--;
					break;
				}
			}
			
		}
		
  var data = d3.nest()
    .key(function(d) {return d.Date; })
	.key(function(d) {
		
		//Deals with the different parameters the user can choose
		switch(to_show) {
			case 0:
				change_color_domain(4143);
				return d['Calories Burned'];
				break;
			case 1:
				change_color_domain(15000);
				return d.Steps;
				break;
			case 2:
				change_color_domain(9.135);
				return d.Distance;
				break;
			case 3:
				change_color_domain(36.17);
				return d.Floors;
				break;
			case 4:
				change_color_domain(1436);
				return d['Minutes Sedentary'];
				break;
			case 5:
				change_color_domain(289);
				return d['Minutes Lightly Active'];
				break;
			case 6:
				change_color_domain(124);
				return d['Minutes Fairly Active'];
				break;
			case 7:
				change_color_domain(62);
				return d['Minutes Very Active'];
				break;
			case 8:
				change_color_domain(2188);
				return d['Activity Calories'];
				break;
			case 9:
				change_color_domain(484);
				return d['Minutes Asleep'];
				break;
			case 10:
				change_color_domain(44.67);
				return d['Minutes Awake'];
				break;
			case 11:
				change_color_domain(24.00);
				return d['Number of Awakenings'];
				break;
			case 12:
				change_color_domain(516);
				return d['Time in Bed'];
				break;
			default:
				console.log("Derp");
		}
		
		
		return d.Steps; 
			
		})

    .map(csv); 

	//console.log(data);
	for(var key in data)	
	{	
		var total = 0;
		for(var key1 in data[key])
		{
			total += Number(key1);
		}
		data[key] = Math.round((total/Object.keys(data[key]).length)*100)/100;
	}


  	rect.transition()
		.duration(0)
		.delay(function(d, i) {
			if (true) {
				return i *4;
			} else {
				return 0
			};
		}) 
		.attr("class", function(d) { 
		
		return "day " + color(data[d]); 
	  
	  
		})
    .select("title")
      .text(function(d) { return d + " : " + data[d]; })
	});

}

// Creates a path around the month of each year
function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}


// Creates a month legend
var legend = svg.selectAll(".legend")
      .data(month)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (((i+1) * 75)-20) + ",0)"; });

// Appends the month text to the legend
legend.append("text")
   .attr("class", function(d,i){ return month[i] })
   .style("text-anchor", "end")
   .attr("dy", "-.25em")
   .text(function(d,i){ return month[i] });
   
   
// Creates the day of the month text
for (var i=0; i<7; i++)
{    
	svg.append("text")
		.attr("transform", "translate(-5," + cellSize*(i+1) + ")")
		.style("text-anchor", "end")
		.style("font-size", "10px")
		.attr("dy", "-.25em")
		.text(function(d) { return week_days[i]; }); 
 }
 

 
 // Creates the buttons and option menus that we need
function createButtons() {

	var buttonsData = [
		{name:"", target: "paras"},
	];
	
	var color_index = 0;

	var buttonGroups = d3.selectAll("#buttons").selectAll(".buttonGroup")
		.data(buttonsData).enter()

		.append("span").attr("class", "buttonGroup");

	buttonGroups.append("label").html(function(d){return d.name;});
	
	buttonGroups.style("font-size", "12px");
	buttonGroups.append("select")
		.on("change", function(d) {
			var selectedIndex = d3.select(this).property('selectedIndex');
			if (d.target == "paras") {
				xAxisIndex = selectedIndex;
			}
			barChartIndex = selectedIndex;
			parameter_choice = selectedIndex;
			update_vis_data(selectedIndex);
			loadBarChart();
			build_legend();
		})
		.selectAll("option")
			.data(para_choices).enter()
			.append("option")
			.text(function(d) { return d; })
			.style("background-color",  function() {
			
				return color_choices[color_index++];
			});

}


function toggleBorders() {
	

	var is_on = d3.select(".month").attr("d");
	if (is_on != null) {
		svg.selectAll(".month")
		.attr("d", null);
	}
	else {
	svg.selectAll(".month")
		.attr("d", monthPath);
	}
}
function loadScript(url)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;



    // Fire the loading
    head.appendChild(script);
}


//loadBarChart();
function loadBarChart()
{
	d3.select("#BARCHART").remove();
	//console.log(barChartDate);
	
	var margin = {top: 150, right: 20, bottom: 30, left: 70},
		width = 1100 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	//var x = d3.scale.ordinal()
	  //  .rangeRoundBands([0, width], .1);
	  
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
		return "<style='color:red'><center>" + d[para_choices[barChartIndex]].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</center></span>";
	  })	

	svg2 = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("id","BARCHART")
		.attr("class", "RdYlGn")
		.style("display", "block")
		.style("margin", "auto")
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		barChartSetup = true;
		
	svg.call(tip);

	var names = [];

	d3.csv("All_data.csv", function(error, csv) {


		if (error) throw error;

		var dataT = [];
		//console.log(csv);
		//console.log(csv.length);
		for(i =0;i<csv.length;i++)
		{
			if (csv[i].Date === barChartDate)
			{
				//csv.splice(i, 1);
				dataT.push(csv[i]);
			}
			else{
				//console.log(csv[i].Date);
				//console.log(barChartDate);
				//console.log();
			}
		
		}
		//console.log(barChartDate);
		//console.log(csv);


		//Cleans data
		var list_len = dataT.length;
		var delete_num = 0;
		
		for(i=0;i<dataT.length;i++)
		{
			if(dataT[i][para_choices[barChartIndex]] === 0 || dataT[i][para_choices[barChartIndex]] === "0")
			{
				
				dataT.splice(i,1);
				i--;
			}
		}
		
		//Cleans data according to user-set  filters

		for(i=0;i<dataT.length;i++)
		{
			for(j=0;j<vetoNames.length;j++)
			{
				if(dataT[i]["Name"] === vetoNames[j])
				{
					dataT.splice(i,1);
					i--;
					break;
				}
			}
			
		}
		console.log(dataT);
		//Sorts Data
		dataT.sort(function(a, b) {
			return parseFloat(b[para_choices[barChartIndex]]) - parseFloat(a[para_choices[barChartIndex]]);
		});

		
		y.domain([0, d3.max(dataT, function(d) { return maxValuesBar[barChartIndex]})]); //CHANGE

		//The box for the bar chart title
		svg2.append("rect")
			.attr("x", (width /2)-150)
			.attr("y", -80)
			.attr("width", 300)
			.attr("height", 50)
			.style("fill", color_choices[barChartIndex])
		
		// Which data the barchart is showing
		svg2.append("text")
			.attr("x", (width / 2))             
			.attr("y", -60)
			.attr("text-anchor", "middle")  
			.style("font-size", "16px")
			.style("fill", "white")
			.text(para_choices[barChartIndex]);
			
		// Date the barchart is showing
		svg2.append("text")
			.attr("x", (width / 2))             
			.attr("y", -40)
			.attr("text-anchor", "middle")  
			.style("font-size", "12px")
			.style("fill", "white")
			.text(barChartDate);
		
		// yaxis for the bar chart
		svg2.append("g")
			.attr("class", "yAxis")
			.call(yAxis)
				.append("text")
				.attr("class", "label")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.style("text-anchor", "end")
		
		// xaxis for barchart
		svg2.append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
				.attr("y", 30)
				.attr("x", width/2)
				.style("text-anchor", "middle")
				.text("User");
		
		var num_bars_done = 0;
		
		// Labels on x axis
		for(i = 0; i<dataT.length;i++)
		{
			svg2.append("text")
				.attr("x", 23+(i*50))             
				.attr("y", 340)
				.attr("text-anchor", "middle")  
				.style("font-size", "10px")
				.style("fill", "black")
				.text(dataT[i]["Name"]);
		}

		// The bars themselves
		svg2.selectAll(".bar")
			.data(dataT)
		.enter().append("rect")
		
			.attr("class", "day q0-13")
			.attr("class", function(d) { 				
				return "day " + color(dataT[num_bars_done++][para_choices[barChartIndex]]);     
				})
			
			.attr("x",  function(d, i) {
				 //this function is called for each data element (therefore for each new <rect>)
				 //'d' is the data element itself, 'i' is its index
				return 3+(i * 50);
			})
			//.attr("x", function(d) { return x(d["Name"]); })
			.attr("width", 40)
			.attr("height", function(d) { return height - y(d[para_choices[barChartIndex]]); })
			.attr("y", function(d) { 
				var displacement = d3.select(this).attr("height");
				return (height-displacement)-1;
			})
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.style("border", "2px solid black")
			.append("text")
				.text("User1")
				.attr("y", 30);

	});



}


function build_user_menu()
{

	var checkList = document.getElementById('list1');
	var items = document.getElementById('items');
        checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
            if (items.classList.contains('visible')){
                items.classList.remove('visible');
                items.style.display = "none";
            }
            
            else{
                items.classList.add('visible');
                items.style.display = "block";
            }           
        }

        items.onblur = function(evt) {
            items.classList.remove('visible');
        }	
}

function build_legend()
{
	console.log("leg hit");
	var max = 0;
	var section = 0;
	var current_num = 0;
	var num_sections = 0;
	if(barChartIndex != 4)
	{		
		if(barChartIndex < 4 || barChartIndex > 7)
		{
			num_sections = 5;
		}
		else
		{
			num_sections = 7;
		}
		
		max = maxDomains[barChartIndex];
		section = Math.round(max/num_sections);
		current_num = 0;
		
		
		var block = document.getElementById("leg_0");
		block.style.background = index1_colors[barChartIndex][0];
		block.style.opacity = 1;
		
		//block.innerHTML= section.toString() + " to " + (current_num+=section).toString();
		block.innerHTML= "1" + " - " + (current_num+=section).toString();
		
		block = document.getElementById("leg_1");
		block.style.background = index1_colors[barChartIndex][1];
		block.style.opacity = 1;
		block.innerHTML= (current_num+1).toString() + " - " + (current_num+=section).toString();
		
		block = document.getElementById("leg_2");
		block.style.background = index1_colors[barChartIndex][2];
		block.style.opacity = 1;
		block.innerHTML= (current_num+1).toString() + " - " + (current_num+=section).toString();
		
		block = document.getElementById("leg_3");
		block.style.background = index1_colors[barChartIndex][3];
		block.style.opacity = 1;
		block.innerHTML= (current_num+1).toString() + " - " + (current_num+=section).toString();
		
		if(barChartIndex < 4 || barChartIndex > 7)
		{
		block = document.getElementById("leg_4");
		block.style.background = index1_colors[barChartIndex][4];
		block.style.opacity = 1;
		block.innerHTML= (current_num+1).toString() + " - " + max.toString();
		
		block = document.getElementById("leg_5");
		block.style.opacity = 0;
		
		block = document.getElementById("leg_6");
		block.style.opacity = 0;
		
		}
		else
		{
				
			block = document.getElementById("leg_4");
			block.style.background = index1_colors[barChartIndex][4];
			block.style.opacity = 1;
			block.innerHTML= (current_num+1).toString() + " - " +  (current_num+=section).toString();
			
			block = document.getElementById("leg_5");
			block.style.background = index1_colors[barChartIndex][5];
			block.style.opacity = 1;
			block.innerHTML= (current_num+1).toString() + " - " +  (current_num+=section).toString();
			
			block = document.getElementById("leg_6");
			block.style.background = index1_colors[barChartIndex][6];
			block.style.opacity = 1;
			block.innerHTML= (current_num+1).toString() + " - " +  max.toString();
		}

	}
	else{
		//Stupid sedentary minutes
		console.log("hiiiiiiii");
		console.log(barChartIndex);
		max = maxDomains[barChartIndex];
		section = Math.round(max/7);
		current_num = max;

		var block = document.getElementById("leg_0");
		block.style.background = index1_colors[barChartIndex][0];
		block.style.opacity = 1;
		block.innerHTML= max + " - " + (current_num-=section).toString();
		
		block = document.getElementById("leg_1");
		block.style.background = index1_colors[barChartIndex][1];
		block.style.opacity = 1;
		block.innerHTML= (current_num-1) + " - " + (current_num-=section).toString();
		
		block = document.getElementById("leg_2");
		block.style.background = index1_colors[barChartIndex][2];
		block.style.opacity = 1;
		block.innerHTML= (current_num-1) + " - " + (current_num-=section).toString();
		
		block = document.getElementById("leg_3");
		block.style.background = index1_colors[barChartIndex][3];
		block.style.opacity = 1;
		block.innerHTML= (current_num-1) + " - " + (current_num-=section).toString();
		
		block = document.getElementById("leg_4");
		block.style.background = index1_colors[barChartIndex][4];
		block.style.opacity = 1;
		block.innerHTML= (current_num-1) + " - " + (current_num-=section).toString();
		
		block = document.getElementById("leg_5");
		block.style.background = index1_colors[barChartIndex][5];
		block.style.opacity = 1;
		block.innerHTML= (current_num-1) + " - " + (current_num-=section).toString();
		
		block = document.getElementById("leg_6");
		block.style.background = index1_colors[barChartIndex][6];
		block.style.opacity = 1;
		block.innerHTML= (current_num-1) + " - " + "0"
		
	}
}

//GUESS I'M GOING TO DO IT THIS WAY....
document.getElementById("user1_box").onclick = function()
{
	if (this.checked) {

		vetoNames.splice((vetoNames.indexOf("User 1")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 1");
		
		if(test == -1)
		{	
			vetoNames.push("User 1");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
	console.log(vetoNames);
}

document.getElementById("user2_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 2")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 2");
		
		if(test == -1)
		{	
			vetoNames.push("User 2");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("user3_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 3")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 3");
		
		if(test == -1)
		{	
			vetoNames.push("User 3");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user4_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 4")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 4");
		
		if(test == -1)
		{	
			vetoNames.push("User 4");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user5_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 5")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 5");
		
		if(test == -1)
		{	
			vetoNames.push("User 5");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user6_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 6")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 6");
		
		if(test == -1)
		{	
			vetoNames.push("User 6");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user7_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 7")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 7");
		
		if(test == -1)
		{	
			vetoNames.push("User 7");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user8_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 8")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 8");
		
		if(test == -1)
		{	
			vetoNames.push("User 8");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user9_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 9")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 9");
		
		if(test == -1)
		{	
			vetoNames.push("User 9");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user10_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 10")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 10");
		
		if(test == -1)
		{	
			vetoNames.push("User 10");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user11_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 11")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 11");
		
		if(test == -1)
		{	
			vetoNames.push("User 11");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user12_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 12")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 12");
		
		if(test == -1)
		{	
			vetoNames.push("User 12");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user13_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User13")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 13");
		
		if(test == -1)
		{	
			vetoNames.push("User 13");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user14_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 14")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 14");
		
		if(test == -1)
		{	
			vetoNames.push("User 14");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("user15_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 15")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 15");
		
		if(test == -1)
		{	
			vetoNames.push("User 15");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("user16_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 16")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 16");
		
		if(test == -1)
		{	
			vetoNames.push("User 16");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("user17_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 17")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 17");
		
		if(test == -1)
		{	
			vetoNames.push("User 17");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("user18_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 18")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 18");
		
		if(test == -1)
		{	
			vetoNames.push("User 18");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("user19_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("User 19")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("User 19");
		
		if(test == -1)
		{	
			vetoNames.push("User 19");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("benny_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("Benny")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("Benny");
		
		if(test == -1)
		{	
			vetoNames.push("Benny");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

document.getElementById("allison_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("Allison")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("Allison");
		
		if(test == -1)
		{	
			vetoNames.push("Allison");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("debbe_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("Debbe")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("Debbe");
		
		if(test == -1)
		{	
			vetoNames.push("Debbe");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("lester_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("Lester")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("Lester");
		
		if(test == -1)
		{	
			vetoNames.push("Lester");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("carina_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("Carina")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("Carina");
		
		if(test == -1)
		{	
			vetoNames.push("Carina");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}
document.getElementById("brandon_box").onclick = function()
{
	if (this.checked) {
		vetoNames.splice((vetoNames.indexOf("Brandon")), 1)
	}
	else{
		var test = -1;
		test = vetoNames.indexOf("Brandon");
		
		if(test == -1)
		{	
			vetoNames.push("Brandon");
		}
	}
	update_vis_data(barChartIndex);
	loadBarChart();
}

















































