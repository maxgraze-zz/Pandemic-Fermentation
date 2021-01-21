import scroller from './scroller.js';

let simulation, nodes;
let histYScale, histXScale, histYAccessor, histXAccessor, colorAccessor;
let keys, dataByMonth;
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
    processData();
    createScales();
    setTimeout(drawInitial(), 200);
});



const updateTransition = d3.transition()
    .duration(600)
    .ease(d3.easeBackIn);

function processData() {
    keys = Object.keys(_.groupBy(data, 'Month'));
    dataByMonth = Array.from(d3.group(data, d => d.Month), ([key, value]) => ({ key, value }));
}
function createScales() {
    
    histYAccessor = d => d.value.length;
    histXAccessor = d => d.key;
    colorAccessor = d => d.Type;
            
    histXScale = d3.scaleBand()
        .domain(keys)
        .range([0, dimensions.boundedWidth])
        .padding(0.1);
        
    histYScale = d3.scaleLinear()
        .domain([0, 20])
        .range([dimensions.boundedHeight, 0]);
    
}
    
    
export function drawInitial() {
    let keys = Object.keys(_.groupBy(data, 'Month'));
    let dataByMonth = Array.from(d3.group(data, d => d.Month), ([key, value]) => ({ key, value }));
    const histKeys = Object.keys(dataByMonth);
            
        
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
        .attr('class', 'x-axis')
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
    // let simulation, nodes;
    
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

export function draw1() {


    // console.log(colorObj[colorAccessor(dataByMonth[0])]);
 
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
        .attr('fill', 'black')
        // .attr('fill', d => colorObj[colorAccessor(d)])

        .style('opacity', .5);


        // .data(d => d3.range(histYAccessor(d) + 1));

}

export function draw2() {

    bounds.selectAll('.x-axis').transition().remove();

    // var simulation = d3.forceSimulation()
    //     .force('center', d3.forceCenter().x(width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
    //     .force('charge', d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    //     .force('collide', d3.forceCollide().strength(.01).radius(30).iterations(1)); // Force that avoids circle overlapping
      

    let circle = bounds.selectAll('circle')
        .data(data)
        .transition().duration(500).delay(100)
        .attr('fill', d => colorObj[colorAccessor(d)])
        .attr('stroke', '#000')
        .transition()
        .attr('r', d => d.Length * 3)


        ;
        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        
    // simulation
    //     .nodes(data)
    //     .on('tick', function(data){
    //         nodes
    //             .attr('cx', function(d){ return d.x; })
    //             .attr('cy', function(d){ return d.y; });
    //     });
  
         

    // simulation.alpha(0.9).restart();


}

function draw3() {

    const xAccessor = d => d.Month;
    simulation = d3.forceSimulation(data)
        .force('center', d3.forceCenter().x(dimensions.boundedWidth / 2).y(dimensions.boundedHeight / 2)) // Attraction to the center of the svg area
     // .force("x",d3.forceX().strength(0.2).x(d => histXScale(histYAccessor(d))))
        // .force('x', d3.forceX(d => histXScale(xAccessor(d))))

        // .force('y', d3.forceY(d => 0))

        .force('charge', d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
        .force('collide', d3.forceCollide().strength(.01).radius(20).iterations(1)) // Force that avoids circle overlapping
        .stop()
        .tick(140);

    let circle = bounds.selectAll('circle')
        // .data(data)
        // .join('circle')
        .join('circle')
        .transition().duration(500).delay(100)
        //.attr('fill', 'black')
        .attr('fill', d => colorObj[colorAccessor(d)])
        .attr('r', d => d.Length * 3)
				// this uses the x/y attributes set on data by forceSimulation
        .attr('cx', (d, i) => d.x)
        .attr('cy', (d, i) => d.y);

    // simulation.stop();
    // let circle = bounds.selectAll('circle')
    //     // .enter()
    //     // .merge(circle)
    //     .transition().duration(500).delay(100)
    //     .attr('fill', 'black')
    //     .attr('r', 3);
    //         // .attr('cx', (d, i) => histXScale(histYAccessor(d)) + 5)
    //         // .attr('cy', (d, i) => i * 5.2 + 30);
    // var simulation = d3.forceSimulation(data)
    //     .force('center', d3.forceCenter().x(width / 2).y(dimensions.height / 2)) // Attraction to the center of the svg area
    //     .force('charge', d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
    //     .force('collide', d3.forceCollide().strength(.01).radius(30).iterations(1)); // Force that avoids circle overlapping
      
        
    // simulation
    //     .nodes(data)
    //     .on('tick', function(d){
    //         circle
    //             .attr('cx', function(d){ return d.x; })
    //             .attr('cy', function(d){ return d.y; });
    //     });
         
}



let activationFunctions = [
    draw1,
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
        var funName = activationFunctions[i - 1];
        funName();
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