let colorMap = {
    'tangent': 'rgb(213, 98, 98)', // red
    'cotangent':'lightblue',
    'sine': 'brown',
    'cosine':'lightgrey',
    'secant':'rgb(217, 132, 79)',
    'cosecant':'orange', 
    'hypoteneuse':'lightgreen'
}

let svg = d3.select('svg');
let svgWidth = svg.attr('width');
let svgHeight = svg.attr('height');

let drawLine = (name, x1,x2, y1, y2, strokeWidth) =>{
    svg.append('line')
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', y1)
        .attr('y2', y2)
        .attr('stroke', colorMap[name])
        .attr('stroke-width', strokeWidth)
        .attr('class',name+'-line');
}

let xAxis = svg.append('line')
    .attr('x1',0)
    .attr('x2',svgWidth)
    .attr('y1', svgHeight/2)
    .attr('y2',svgHeight/2)
    .attr('stroke','black');

let yAxis = svg.append('line')
    .attr('x1', svgWidth / 2)
    .attr('x2', svgWidth/2)
    .attr('y1', 0)
    .attr('y2', svgHeight)
    .attr('stroke', 'black');

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

let hypoteneuse = svg.append('line')
    .attr('x1', svgWidth / 2)
    .attr('x2', (svgWidth / 2) + svgWidth / 4)
    .attr('y1', svgHeight / 2)
    .attr('y2', (svgHeight / 2))
    .attr('stroke',colorMap['hypoteneuse'])
    .attr('stroke-width', '2px');
    ;

let sine = svg.append('line')
    .attr('x1', (svgWidth / 2) + svgWidth / 4)
    .attr('x2', (svgWidth / 2) + svgWidth / 4)
    .attr('y1', svgHeight / 2)
    .attr('y2', (svgHeight / 2))
    .attr('stroke', colorMap['sine'])
    .attr('stroke-width', '2px');


let cosine = svg.append('line')
    .attr('x1', (svgWidth / 2))
    .attr('x2', (svgWidth / 2) + svgWidth / 4)
    .attr('y1', svgHeight / 2)
    .attr('y2', (svgHeight / 2))
    .attr('stroke', colorMap['cosine'])
    .attr('stroke-width','2px');

let tangent = svg.append('line')
    .attr('x1', (svgWidth / 2) + svgWidth / 4)
    .attr('x2', (svgWidth / 2) + svgWidth / 4)
    .attr('y1', svgHeight / 2)
    .attr('y2', (svgHeight / 2))
    .attr('stroke', colorMap['tangent'])
    .attr('stroke-width', '2px')
    .text('hi');

var tangentText = svg.append("text")
    .attr("y", tangent.attr('y2'))//magic number here
    .attr("x", tangent.attr('x2'))
    .attr('text-anchor', 'right')
    .attr("class", "tangent-label")//easy to style with CSS
    .text("tan");

let secant = svg.append('line')
    .attr('x1', (svgWidth / 2))
    .attr('x2', (svgWidth / 2) + svgWidth / 4)
    .attr('y1', svgHeight / 2)
    .attr('y2', (svgHeight / 2))
    .attr('stroke', colorMap['secant'])
    .attr('stroke-dasharray', '5,5')
    .attr('stroke-width', '2px');

let angle = Math.atan2(1, 0);
let ratio2 = (Math.sin(angle) / Math.cos(angle));

let cotangent = svg.append('line')
    .attr('x1', (svgWidth / 2))
    .attr('x2', (svgWidth / 2) + ((1 * ratio2) * (svgWidth / 4)))
    .attr('y1', svgHeight / 2 - (svgWidth / 4))
    .attr('y2', svgHeight / 2 - (svgWidth / 4))
    .attr('stroke', colorMap['cotangent'])
    .attr('stroke-dasharray', '3,3')
    .attr('stroke-width', '2px');

let cosecant = svg.append('line')
    .attr('x1', (svgWidth / 2))
    .attr('x2', cotangent.attr('x2'))
    .attr('y1', svgHeight / 2)
    .attr('y2', cotangent.attr('y2'))
    .attr('stroke', colorMap['cosecant'])
    .attr('stroke-dasharray', '2,2')
    .attr('stroke-width', '2px');

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
            drawSine(angle);
            drawCosine(angle);
            drawTangent(coordinates,angle);
            drawCotangent(coordinates,angle);
            drawCosecant();

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

let drawHypoteneuse = (coordinates, angle) =>{
    hypoteneuse
        .attr('x1', svgWidth/2)
        .attr('x2', (svgWidth / 2) + (Math.cos(angle) * svgWidth / 4))
        .attr('y1', svgHeight / 2)
        .attr('y2', (svgHeight / 2) + (Math.sin(angle) * svgWidth / 4));
}

let drawSine=(angle)=>{
    sine
        .attr('x1', (svgWidth / 2) + Math.cos(angle) * svgWidth / 4)
        .attr('x2', (svgWidth / 2) + Math.cos(angle) * svgWidth / 4)
        .attr('y1', svgHeight / 2)
        .attr('y2', (svgHeight / 2) + (Math.sin(angle) * svgWidth / 4));
}

let drawCosine = (angle) => {
    cosine
        .attr('x1', (svgWidth / 2))
        .attr('x2', (svgWidth / 2) + Math.cos(angle) * svgWidth / 4)
        .attr('y1', svgHeight / 2)
        .attr('y2', (svgHeight / 2));
}

let drawSecant=(coordinates,angle)=>{
    let x1 = (svgWidth / 2);
    let y1 = (svgHeight / 2);
    let x2 = tangent.attr('x2');
    let y2 = tangent.attr('y2');

    secant
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', y1)
        .attr('y2', y2);

}


let drawTangent =(coordinates,angle)=>{
    tangentText
        .attr("y", tangent.attr('y2'))//magic number here
        .attr("x", tangent.attr('x2'));

    let ratio = (Math.sin(angle) / Math.cos(angle));
    if (coordinates[0] < svgWidth / 2){
        // Draw tangent on the left side 
        tangent
            .attr('x1', (svgWidth / 2) - svgWidth / 4)
            .attr('x2', (svgWidth / 2) - svgWidth / 4)
            .attr('y1', svgHeight / 2)
            .attr('y2', (svgHeight / 2) + (-1 * ratio * (svgWidth / 4)));
    }else{
        tangent
            .attr('x1', (svgWidth / 2) + svgWidth / 4)
            .attr('x2', (svgWidth / 2) + svgWidth / 4)
            .attr('y1', svgHeight / 2)
            .attr('y2', (svgHeight / 2) + ratio * (svgWidth / 4));
    }
}

let drawCotangent=(coordinates,angle)=>{
    let ratio2 = (Math.cos(angle) / Math.sin(angle));

    if (coordinates[1] > (svgHeight / 2)) {
        cotangent
            .attr('x1', (svgWidth / 2))
            .attr('x2', (svgWidth / 2) + ((1 * ratio2) * (svgWidth / 4)))
            .attr('y1', svgHeight / 2 + (svgWidth / 4))
            .attr('y2', svgHeight / 2 + (svgWidth / 4));
    } else {
        // Draw tangent on the top side
        cotangent
            .attr('x1', (svgWidth / 2))
            .attr('x2', (svgWidth / 2) - ((1 * ratio2) * (svgWidth / 4)))
            .attr('y1', svgHeight / 2 - (svgWidth / 4))
            .attr('y2', svgHeight / 2 - (svgWidth / 4));

    }
}


let drawCosecant = () => {
    let x1 = (svgWidth / 2);
    let y1 = (svgHeight / 2);
    let x2 = cotangent.attr('x2');
    let y2 = cotangent.attr('y2');

    cosecant
        .attr('x1', x1)
        .attr('x2', x2)
        .attr('y1', y1)
        .attr('y2', y2);
}

moveCircle();

