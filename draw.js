import scroller from './scroller.js';

// d3.graphScroll();
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
    
const colors = ['#a497b8', '#bbd0d1', '#ffffe0', '#ffbcaf', '#f4777f', '#cf3759', '#93003a'];
const type = ['Fruit', 'Vegetable', 'Grain', 'Protein', 'Other'];

const colorObj = {
    Fruit : '#a497b8',
    Vegetable: '#bbd0d1',
    Grain: '#ffffe0',
    Protein: '#ffbcaf',
    Other: '#cf3759',

};

const colorScale = d3.scaleOrdinal(colors, type);
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
const button2 = d3.select('body')
    .append('button')
    .text('draw2');
const button3 = d3.select('body')
    .append('button')
    .text('draw3');

button2.node().addEventListener('click', click);
function click() {
    draw2();
}

button3.node().addEventListener('click', clicky);
function clicky() {
    draw3();
}


const updateTransition = d3.transition()
    .duration(600)
    .ease(d3.easeBackIn);


function createScales() {
    
}
export function drawInitial() {
    
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
    let simulation, nodes;
    
    simulation = d3.forceSimulation(data);
    
    // Define each tick of simulation
    simulation.on('tick', () => {
        nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });
    simulation.stop();
    nodes = bounds.append('g')
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

export function drawHistoDots() {

    let keys = Object.keys(_.groupBy(data, 'Month'));
    let dataByMonth = Array.from(d3.group(data, d => d.Month), ([key, value]) => ({ key, value }));

    const histYAccessor = d => d.value.length;
    const histXAccessor = d => d.key;
    const colorAccessor = d => d.value.Type;
        
    const histXScale = d3.scaleBand()
        .domain(keys)
        .range([0, dimensions.boundedWidth])
        .padding(0.1);
    
    const histYScale = d3.scaleLinear()
        .domain([0, 20])
        .range([dimensions.boundedHeight, 0]);

    // console.log(colorObj[colorAccessor(dataByMonth[0])]);
    console.log(dataByMonth[0].value[2]);
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
        
    console.log(colorScale(colorAccessor(dataByMonth[2])));
    const dots = groups.selectAll('circle')
        .data(d => d3.range(1, histYAccessor(d) + 1))
        .enter().append('circle')
        .transition().duration(600).ease(d3.easeBounceOut)
        .attr('class', 'dot')
        .attr('r', 10)
        .attr('cy', function(d) {
            return histYScale(d);
        })
        .attr('fill', d => colorObj[colorAccessor(d)])

        .style('opacity', .5)


        .data(d => d3.range(histYAccessor(d) + 1));

    // const binData = d3.bins().domain([0, 1])(dataByMonth);
        // Selection of all the circles 
    // console.log((d3.range(histYAccessor(dataByMonth[1])))); 
    // let nodes = bounds
    //     .append('g')
    //     .selectAll('circle')
    //     .data(dataByMonth)
    //     // .enter()
    //     // .append('circle')
    //     // .data(d => d3.range(histYAccessor(d) + 1))
    //     .join('circle')
    //     .attr('class', 'histcircles')
    //     .attr('fill', d => colorAccessor(colorAccessor(d)))
    //     .attr('r', 5)
    //     .attr('cx', d => histXScale(histXAccessor(d)))
    //     .attr('cy', d => histYScale(histYAccessor(d)))
    //     // .attr('cx', dimensions.boundedWidth / 2)
    //     // .attr('cy', dimensions.boundedHeight / 2)
    //     .attr('opacity', 0.8);

}

export function draw2() {

    let keys = Object.keys(_.groupBy(data, 'Month'));
    let dataByMonth = Array.from(d3.group(data, d => d.Month), ([key, value]) => ({ key, value }));

    const histYAccessor = d => d.Month;
    const colorAccessor = d => d.Type;

    const histXScale = d3.scaleBand()
        .domain(keys)
        .range([0, dimensions.boundedWidth])
        .padding(0.1);

    var simulation = d3.forceSimulation()
        .force('center', d3.forceCenter().x(width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
        .force('charge', d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
        .force('collide', d3.forceCollide().strength(.01).radius(30).iterations(1)); // Force that avoids circle overlapping
      

    let nodes = bounds.selectAll('circle')
        .data(data)
        .transition().duration(500).delay(100)
        .attr('fill', d => colorObj[colorAccessor(d)])
        ;
        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        
    simulation
        .nodes(data)
        .on('tick', function(data){
            nodes
                .attr('cx', function(d){ return d.x; })
                .attr('cy', function(d){ return d.y; });
        });
  
         

    // simulation.alpha(0.9).restart();


}

function draw3() {

    let keys = Object.keys(_.groupBy(data, 'Month'));
    let dataByMonth = Array.from(d3.group(data, d => d.Month), ([key, value]) => ({ key, value }));

    const histYAccessor = d => d.Month;
    const colorAccessor = d => d.Type;

    const histXScale = d3.scaleBand()
        .domain(keys)
        .range([0, dimensions.boundedWidth])
        .padding(0.1);
        
    let circle = bounds.selectAll('circle')
        // .enter()
        // .merge(circle)
        .transition().duration(500).delay(100)
        .attr('fill', 'black')
        .attr('r', 3);
            // .attr('cx', (d, i) => histXScale(histYAccessor(d)) + 5)
            // .attr('cy', (d, i) => i * 5.2 + 30);
    var simulation = d3.forceSimulation(data)
        .force('center', d3.forceCenter().x(width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
        .force('charge', d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
        .force('collide', d3.forceCollide().strength(.01).radius(30).iterations(1)); // Force that avoids circle overlapping
      
        
    simulation
        .nodes(data)
        .on('tick', function(d){
            circle
                .attr('cx', function(d){ return d.x; })
                .attr('cy', function(d){ return d.y; });
        });
         
}



let activationFunctions = [
    drawInitial,
    draw2,
    draw3,
];

let scroll = scroller()
    .container(d3.select('#graphic'));
scroll();

let lastIndex, activeIndex = 0;

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function(d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index;
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    });
    lastIndex = activeIndex;

});

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){
    }
});

// `window.addEventListener("scroll", () => {
//     console.log(window.scrollY)
//     console.log(window.scrollMaxY)`
// })