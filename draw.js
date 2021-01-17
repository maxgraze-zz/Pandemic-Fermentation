// import _ from 'lodash';

let width = 600;
let dimensions = {
    width: width,
    height: width,
    margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50
    }
};
dimensions.boundedWidth =
dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight =
dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

const colors = [];
const type = ['Grain', 'Vegetable', 'Fruit', 'Protein', 'Other'];
let data;
d3.json('data/fermented.json').then(dataset => {
    data = dataset;
    // createScales();
    setTimeout(drawInitial(), 200);
});

function createScales() {
    
}
function drawInitial() {
    
    const dataByMonth = _.groupBy(data, 'Month');
    
    const colorScale = d3.scaleOrdinal(type, colors);
   
    
    
    const wrapper = d3
        .select('#vis')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);
    
    const bounds = wrapper.append('g')
        .style('transform', `translate(${dimensions.margin.left}px, 
            -200px`);
        // .style('transform', `translate(${dimensions.margin.left}px, 
        //     ${dimensions.margin.top}px`);
        //Histogram function
    const histData = d3.entries(dataByMonth);
    const histXAccessor = d => d.key;
    const histYAccessor = d => d.value.length;
        
    console.log(histXAccessor(histData[0]));
    const histXScale = d3.scaleBand()
        .domain(d3.keys(dataByMonth))
        .range([0, dimensions.boundedWidth]);
    console.log(histXScale.domain()); 
    const histYScale = d3.scaleLinear()
        .domain([0, 20])
        .range([dimensions.boundedHeight, 0]);

    const xAxisGenerator = d3.axisBottom().scale(histXScale);
    const yAxisGenerator = d3.axisLeft().scale(histYScale);


    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${dimensions.boundedHeight}px)`);

    //Accessor Functions 
    const month = d => d.Month ;
    const length = d => d.Length;


        
        // Selection of all the circles 
    console.log(histData); 
    let nodes = bounds
        .append('g')
        .selectAll('circle')
        .data(histData)
        // .enter()
        // .append('circle')
        .join('circle')
        .attr('class', 'histcircles')
        .attr('fill', 'black')
        .attr('r', 5)
        .attr('cx', d => histXScale(histXAccessor(d)))
        .attr('cy', d => histYScale(histYAccessor(d)))
        // .attr('cx', dimensions.boundedWidth / 2)
        // .attr('cy', dimensions.boundedHeight / 2)
        .attr('opacity', 0.8);
    
        
    // var simulation = d3.forceSimulation()
    //     .force('center', d3.forceCenter().x(width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
    //     .force('charge', d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    //     .force('collide', d3.forceCollide().strength(.01).radius(30).iterations(1)); // Force that avoids circle overlapping
    
    // // Apply these forces to the nodes and update their positions.
    // // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    // simulation
    //     .nodes(data)
    //     .on('tick', function(d){
    //         nodes
    //             .attr('cx', function(d){ return d.x; })
    //             .attr('cy', function(d){ return d.y; });
    //     });
         
    // let simulation = d3.forceSimulation(data);
        // Define each tick of simulation
        
        // simulation.on('tick', () => {
        //     nodes
        //         .attr('cx', d => d.x)
        //         .attr('cy', d => d.y);
        // });

// Stop the simulation until later
    // simulation.stop();

    // const histAxis = d3.axisBottom(monthScale);
}

