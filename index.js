
document.addEventListener("DOMContentLoaded", () => {
    fetch("./JSON/Access Your Anger - Hayley Ep 5_pretty_tx.json")
    .then(res => res.json())
    .then((data) => {
        const chartData = data.utterances.filter(item => item.speaker === "A");
        const wordData = data.words.filter(item => item.speaker === "A").map(item => item.text).map(word => word.replace(/[^\w\s]|_/g, "").toLowerCase());
        console.log(wordData);
        drawChart(chartData)
        WordCloud(wordData, {
            width: 1000,
            height: 500,
            fill: "red",
            // size: () => .3 + Math.random(),
            // rotate: () => (~~(Math.random() * 6) - 3) * 90
            // invalidation // a promise to stop the simulation when the cell is re-run
        })
    })
})

function drawChart(data) {
    const width = 1000;
    const height = 300;
    const marginTop = 30;
    const marginRight = 30;
    const marginBottom = 60;
    const marginLeft = 60;
    
    const svg = d3.create("svg")
        .attr("width", width + marginLeft + marginRight)
        .attr("height", height + marginTop + marginBottom)
        .style("border", "1px solid black");

    const timeExtent = d3.extent(data, d => d.start);
    const minutes = timeExtent.map(time => time/60000);
    console.log(d3.max(data, d => d.density))
    
    const x = d3.scaleLinear()
        .domain(minutes)
        .nice()
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.density)])
        .nice()
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${height + marginTop})`)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, ${marginTop})`)
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d.start / 60000))
        .y(d => y(d.density));

    svg.append("g")
        .append("path")
        .datum(data)
        .attr("d", line)
        .attr("transform", `translate(${marginLeft}, ${marginTop})`)
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 1.5)

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + marginBottom + marginTop / 2)
        .attr("text-anchor", "middle")
        .text("Minutes")

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", marginLeft / 2)
        .attr("text-anchor", "middle")
        .text("Density");

    chart.append(svg.node());
}


function WordCloud(text, {
    size = group => group.length, // Given a grouping of words, returns the size factor for that word
    word = d => d, // Given an item of the data array, returns the word
    marginTop = 10, // top margin, in pixels
    marginRight = 10, // right margin, in pixels
    marginBottom = 10, // bottom margin, in pixels
    marginLeft = 10, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    maxWords = 250, // maximum number of words to extract from the text
    fontFamily = "sans-serif", // font family
    fontScale = 14, // base font size
    fill = null, // text color, can be a constant or a function of the word
    padding = 1, // amount of padding between the words (in pixels)
    rotate = 0, // a constant or function to rotate the words
    invalidation // when this promise resolves, stop the simulation
} = {}) {
    const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
    
    const data = d3.rollups(words, size, w => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, maxWords)
    .map(([key, size]) => ({text: word(key), size}));
    
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("font-family", fontFamily)
        .attr("text-anchor", "middle")
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);

    const cloud = d3.layout.cloud()
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .words(data)
        .padding(padding)
        .rotate(rotate)
        .font(fontFamily)
        .fontSize(d => Math.sqrt(d.size) * fontScale)
        .on("word", ({size, x, y, rotate, text}) => {
        g.append("text")
            .datum(text)
            .attr("font-size", size)
            .attr("fill", fill)
            .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
            .text(text);
        });

    cloud.start();
    invalidation && invalidation.then(() => cloud.stop());
    // return svg.node();
    wordCloud.append(svg.node());
}



