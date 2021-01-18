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

const wrapper = d3
    .select('#vis')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

const bounds = wrapper.append('g')
    .style('transform', `translate(${dimensions.margin.left}px, 
    -200px`);
    
const colors = [];
const type = ['Grain', 'Vegetable', 'Fruit', 'Protein', 'Other'];
let data;
d3.json('data/fermented.json').then(dataset => {
    data = dataset;
    // createScales();
    setTimeout(drawInitial(), 200);
});

const button = d3.select('body')
    .append('button')
    .text('Change');

button.node().addEventListener('click', onClick);
function onClick() {
    drawHistoDots();
}


const updateTransition = d3.transition()
    .duration(600)
    .ease(d3.easeBackIn);


function createScales() {
    
}
function drawInitial() {
    
    let keys = Object.keys(_.groupBy(data, 'Month'));
    let dataByMonth = Array.from(d3.group(data, d => d.Month), ([key, value]) => ({ key, value }));
    const histKeys = Object.keys(dataByMonth);

    const colorScale = d3.scaleOrdinal(type, colors);
   
    
        // .style('transform', `translate(${dimensions.margin.left}px, 
        //     ${dimensions.margin.top}px`);
        //Histogram function    // const histXAccessor = d => d.key;
    const histYAccessor = d => d.value.length;
    const histxAccessor = d => d.key;
        
    const histXScale = d3.scaleBand()
        .domain(keys)
        .range([0, dimensions.boundedWidth])
        .padding(0.1);
    
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
    // const binsGroup = bounds.append('g')
    //     .attr('class', 'bin');


    // const binGroups = binsGroup.selectAll('g')
    //     .data(bins).join('g');

    // const barPadding = 1;
    const barRects = bounds.append('g')
        .selectAll('rect')
        .data(dataByMonth)
        .join('rect')
        // .attr('x', (d, i) => histXScale(i))
        .attr('x', (d, i) => histXScale(histxAccessor(d)))
        .attr('y', (d) => histYScale(histYAccessor(d)))
        .attr('width', histXScale.bandwidth())
        .attr('height', (d) => histYScale(0) - histYScale(histYAccessor(d)))
        // .attr('height', (d) => dimensions.boundedHeight - histYScale(histYAccessor(d)))
        .attr('fill', 'cornflowerblue');

    // const barText = bounds.filter(histYAccessor)
    //     .append('text')
    //     .attr('x', (d) => histXScale(histxAccessor)
    //     .attr('y', d => histYScale(histYAccessor(d)) - 5)
    //     .text(histYAccessor)
    //     .style('text-anchor', 'middle')
    //     .style('fill', '#666')
    //     .style('font-size', '12px')
    //     .style('font-family', 'sans-serif');


    // const groups = bounds.selectAll('.groups')
    //     .data(histData)
    //     .enter()
    //     .append('g')
    //     .attr('transform', function(d) {
    //         return 'translate(' + histXScale(histXAccessor(d)) + '.0)';
    //     });

    // const dots = groups.selectAll('circle')
    //     .data(d => d3.range(1, histYAccessor(d) + 1))
    //     .enter().append('circle')
    //     .attr('class', 'dot')
    //     .attr('r', 10)
    //     .attr('cy', function(d) {
    //         return histYScale(d);
    //     })
    //     .style('fill', 'blue')
    //     .style('opacity', .5);


    // .data(d => d3.range(histYAccessor(d) + 1));
    // const binData = d3.bins().domain([0, 1])(histData);
        // Selection of all the circles 
    // console.log((d3.range(histYAccessor(histData[1])))); 
    // let nodes = bounds
    //     .append('g')
    //     .selectAll('circle')
    //     .data(histData)
    //     // .enter()
    //     // .append('circle')
    //     // .data(d => d3.range(histYAccessor(d) + 1))
    //     .join('circle')
    //     .attr('class', 'histcircles')
    //     .attr('fill', 'black')
    //     .attr('r', 5)
    //     .attr('cx', d => histXScale(histXAccessor(d)))
    //     .attr('cy', d => histYScale(histYAccessor(d)))
    //     // .attr('cx', dimensions.boundedWidth / 2)
    //     // .attr('cy', dimensions.boundedHeight / 2)
    //     .attr('opacity', 0.8);
    
        
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

function drawHistoDots() {

    let keys = Object.keys(_.groupBy(data, 'Month'));
    let dataByMonth = Array.from(d3.group(data, d => d.Month), ([key, value]) => ({ key, value }));
    const histKeys = Object.keys(dataByMonth);

    const histYAccessor = d => d.value.length;
    const histXAccessor = d => d.key;
        
    const histXScale = d3.scaleBand()
        .domain(keys)
        .range([0, dimensions.boundedWidth])
        .padding(0.1);
    
    const histYScale = d3.scaleLinear()
        .domain([0, 20])
        .range([dimensions.boundedHeight, 0]);

    

    const xAxisGenerator = d3.axisBottom().scale(histXScale);
    const yAxisGenerator = d3.axisLeft().scale(histYScale);


    const xAxis = bounds.append('g')
        .call(xAxisGenerator)
        .style('transform', `translateY(${dimensions.boundedHeight}px)`);

    bounds.selectAll('rect').transition().duration(200).remove();
    const groups = bounds.selectAll('.groups')
        .data(dataByMonth)
        .enter()
        .append('g')
        .attr('transform', function(d) {
            return 'translate(' + histXScale(histXAccessor(d)) + '.0)';
        });
        
    const dots = groups.selectAll('circle')
        .data(d => d3.range(1, histYAccessor(d) + 1))
        .enter().append('circle')
        .transition().duration(600).ease(d3.easeBounceOut)
        .attr('class', 'dot')
        .attr('r', 10)
        .attr('cy', function(d) {
            return histYScale(d);
        })
        .style('fill', 'blue')
        .style('opacity', .5)


        .data(d => d3.range(histYAccessor(d) + 1));

    const binData = d3.bins().domain([0, 1])(dataByMonth);
        // Selection of all the circles 
    console.log((d3.range(histYAccessor(dataByMonth[1])))); 
    let nodes = bounds
        .append('g')
        .selectAll('circle')
        .data(dataByMonth)
        // .enter()
        // .append('circle')
        // .data(d => d3.range(histYAccessor(d) + 1))
        .join('circle')
        .attr('class', 'histcircles')
        .attr('fill', 'black')
        .attr('r', 5)
        .attr('cx', d => histXScale(histXAccessor(d)))
        .attr('cy', d => histYScale(histYAccessor(d)))
        // .attr('cx', dimensions.boundedWidth / 2)
        // .attr('cy', dimensions.boundedHeight / 2)
        .attr('opacity', 0.8);

}
