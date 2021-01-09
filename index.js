let colorMap = {
    'tangent': 'rgb(213, 98, 98)', // red
    'cotangent':'lightblue',
    'sine': 'brown',
    'cosine':'lightgrey',
    'secant':'rgb(217, 132, 79)',
    'cosecant':'orange', 
    'hypoteneuse':'lightgreen',
    'xAxis':'black',
    'yAxis': 'black'
}

let svg = d3.select('svg');
let svgWidth = svg.attr('width');
let svgHeight = svg.attr('height');

let zeroX = svgWidth / 2;
let zeroY = svgHeight / 2;
let radius = svgWidth / 4;

let drawLine = (name, x1,x2, y1, y2, strokeWidth,dash) =>{
    return svg.append('line')
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', y1)
        .attr('y2', y2)
        .attr('stroke', colorMap[name])
        .attr('stroke-width', strokeWidth)
        .attr('stroke-dasharray', dash)
        .attr('class',name+'-line');
}

// Draw the x and y axis
let drawAxes =()=>{
    let xAxis = drawLine('xAxis', 0, svgWidth, zeroX, zeroY, 3);
    let yAxis = drawLine('yAxis', zeroX, zeroY, 0, svgHeight, 3);
}

drawAxes()


// Draw the border of the circle
var unitCircle = d3.arc()
    .innerRadius(0)
    .outerRadius(svgWidth / 4)
    .startAngle(0) //convert from degs to radians
    .endAngle(2*Math.PI ) //just radians

svg.append("path")
    .attr('fill','none')
    .attr('stroke','black')
    .attr("d", unitCircle)
    .attr("transform", "translate(" +svgWidth/2+","+svgHeight/2+")")

let circle = svg.append('circle')
    .attr('r', svgHeight / 100)
    .attr('cx', svgWidth / 2+svgWidth/4)
    .attr('cy', svgHeight / 2)
    .attr('fill', 'black')
    .attr('stroke', 'black');

let hypoteneuse = drawLine('hypoteneuse', zeroX, zeroX + radius, zeroY, zeroY, 2, '0,0')


let sine = drawLine('sine', zeroX+radius, zeroX + radius, zeroY, zeroY, 2,'0,0');
let cosine = drawLine('cosine', zeroX, zeroX + radius, zeroY, zeroY, 2,'0,0');
let tangent = drawLine('tangent', zeroX + radius, zeroX + radius, zeroY, zeroY, 2,'0,0');
let secant = drawLine('secant', zeroX, zeroX + radius, zeroY, zeroY, 2, '5,5');

let angle = Math.atan2(1, 0);
let ratio2 = (Math.sin(angle) / Math.cos(angle));
let cotangent = drawLine('cotangent', zeroX, zeroX+(radius*ratio2), zeroY-radius, zeroY-radius, 2, '3,3');
let cosecant = drawLine('cosecant', zeroX, cotangent.attr('x2'), zeroY, cotangent.attr('y2'), 2, '5,5');

let trigFunctions = {
    'tangent': tangent, // red
    'cotangent': cotangent,
    'sine': sine,
    'cosine': cosine,
    'secant': secant,
    'cosecant': cosecant,
    'hypoteneuse': hypoteneuse
}

var tangentText = svg.append("text")
    .attr("y", tangent.attr('y2'))//magic number here
    .attr("x", tangent.attr('x2'))
    .attr('text-anchor', 'right')
    .attr("class", "tangent-label")//easy to style with CSS
    .text("tan");

// Moving logic
let moveCircle = ()=>{
    let isDown = false;

    circle.on("click", function () {
        isDown == false ? isDown = true : isDown = false;

    });
    svg.on("mousemove", function () {
        if (isDown) {
            var coordinates = d3.mouse(this);
            let angle = Math.atan2((coordinates[1] - (svgWidth / 2)), (coordinates[0] - (svgWidth / 2)));

            drawArcCircle(coordinates,angle);

            drawSecant(coordinates,angle);
            drawHypoteneuse(coordinates, angle);
            drawSine(coordinates,angle);
            drawCosine(coordinates,angle);
            drawTangent(coordinates,angle);
            drawCotangent(coordinates,angle);
            drawCosecant(coordinates,angle);

        }
    })
}

let drawArcCircle = (coordinates,angle) =>{
    // Need to calculate the coordiates from the mouse to the center of the axes 
    // y = coordinates[1] - (svgWidth / 2)
    // x = coordinates[0] - (svgWidth / 2)

    circle.attr("cx", (svgWidth / 2) + Math.cos(angle) * svgWidth / 4)
    circle.attr("cy", (svgHeight / 2) + Math.sin(angle) * svgWidth / 4)
}

// Used to update the trig function lines
let updateLine = (name,x1, x2, y1, y2) =>{
    trigFunctions[name]
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', y1)
        .attr('y2', y2);
}

let drawHypoteneuse = (coordinates, angle) =>{
    updateLine('hypoteneuse', zeroX, zeroX + (Math.cos(angle) * radius), 
                            zeroY, zeroY + (Math.sin(angle) * radius))
}

let drawSine=(coordinates,angle)=>{
    updateLine('sine', zeroX + (Math.cos(angle)*radius), zeroX + (Math.cos(angle) * radius),
        zeroY, zeroY + (Math.sin(angle) * radius))
}

let drawCosine = (coordinates,angle) => {
    updateLine('cosine', zeroX, zeroX + (Math.cos(angle) * radius),
        zeroY, zeroY)
}

let drawSecant=(coordinates,angle)=>{
    updateLine('secant', zeroX, tangent.attr('x2'),
        zeroX, tangent.attr('y2'))
}

let drawTangent =(coordinates,angle)=>{
    tangentText
        .attr("y", tangent.attr('y2'))//magic number here
        .attr("x", tangent.attr('x2'));

    let ratio = (Math.sin(angle) / Math.cos(angle));
    if (coordinates[0] < svgWidth / 2){
        // Draw tangent on the left side
        updateLine('tangent', zeroX - radius, zeroX - radius,
            zeroY, zeroY + (-1 * ratio * radius))
    }else{
        // Draw on the right side
        updateLine('tangent', zeroX + radius, zeroX + radius,
            zeroY, zeroY + (ratio * radius))
    }
}

let drawCotangent=(coordinates,angle)=>{
    let ratio2 = (Math.cos(angle) / Math.sin(angle));

    if (coordinates[1] > (svgHeight / 2)) {
        updateLine('cotangent', zeroX , zeroX + (ratio2*radius),
            zeroY+radius, zeroY + radius)
    } else {
        // Draw tangent on the top side
        updateLine('cotangent', zeroX, zeroX - (ratio2 * radius),
            zeroY - radius, zeroY - radius)
    }
}


let drawCosecant = (coordinates,angle) => {
    updateLine('cosecant', zeroX, cotangent.attr('x2'),
        zeroY, cotangent.attr('y2'))
}

moveCircle();

