d3.json("../../samples.json").then((importedData) => {
    //initialize the data variables to use later
    var data = importedData.samples;
    var select_list_names = importedData.names;
    var metadata = importedData.metadata;
    
    //write the 153 "names" into the select funtion
    var select_list = d3.select("select");
    select_list_names.forEach(Object=>{
        var option = select_list.append("option");
        option.text(Object);

    })


    //sliced data for bar graph
    var org_data = [];

    data.forEach(Object=> {
        var plot_Data = {};

        ids_OTU = Object.otu_ids.slice(0,10).map(i=> 'OTU '+ i);

        plot_Data = {
            id : Object.id,
            otu_ids: ids_OTU.reverse(),
            otu_labels: Object.otu_labels.slice(0,10).reverse(),
            sample_values: Object.sample_values.slice(0,10).reverse()
        };
        
        org_data.push(plot_Data);

    });

    //unsliced data for bubble graph
    var bub_data = [];

    data.forEach(Object=> {
        var bubplot_Data = {};

        bubplot_Data = {
            id : Object.id,
            otu_ids: Object.otu_ids,
            otu_labels: Object.otu_labels,
            sample_values: Object.sample_values
        };
        
        bub_data.push(bubplot_Data);

    });


    function init(){

        //initialize the bar graph
        var trace1 = [{
            x: org_data[0].sample_values,
            y: org_data[0].otu_ids,
            text:org_data[0].otu_labels,
            type: "bar",
          
            orientation: 'h'
        }]

        Plotly.newPlot("bar", trace1);


        //initialize the demographic data
        var metadat_location = d3.select("#sample-metadata");
        var optionmeta = metadat_location.append("p");
        optionmeta.text(`Sample ID: ${metadata[0].id}`);
        var optionmeta = metadat_location.append("p");
        optionmeta.text(`Sex: ${metadata[0].gender}`);
        var optionmeta = metadat_location.append("p");
        optionmeta.text(`Age: ${metadata[0].age}`);
        var optionmeta = metadat_location.append("p");
        optionmeta.text(`Location: ${metadata[0].location}`);
        var optionmeta = metadat_location.append("p");
        optionmeta.text(`Ethnicity: ${metadata[0].ethnicity}`);
        var optionmeta = metadat_location.append("p");
        optionmeta.text(`bbtype: ${metadata[0].bbtype}`);
        var optionmeta = metadat_location.append("p");
        optionmeta.text(`wfreq: ${metadata[0].wfreq}`);


        //initialize bubble chart
        var bubbletrace = [{
            x: bub_data[0].otu_ids,
            y: bub_data[0].sample_values,
            mode:'markers',
            marker: {
                size: bub_data[0].sample_values,
                color: bub_data[0].otu_ids
            },
            text: bub_data[0].otu_labels
        }]

        var layout = {
            showlegend: false,
            xaxis: {
                title:{
                    text:"OTU ID"
                }
            },
            height: 600,
            width: 1200
        };

        Plotly.newPlot("bubble",bubbletrace,layout);

    };


    init();

    // On change to the DOM, call optionChanged
    d3.selectAll("#selDataset").on('change', optionChanged);
    
    // Function called by DOM changes
    function optionChanged() {
        //select dropdown
        var dropdownMenu = d3.select("#selDataset").node().value;
        

        // Assign the value of the dropdown menu option to a variable
        var value = dropdownMenu;

        //loop through data to restyle bar chart
        org_data.forEach(Object=>{
            if(Object.id == value){

                var barCHART = d3.selectAll("#bar").node();

                Plotly.restyle(barCHART, "x", [Object.sample_values]);
                Plotly.restyle(barCHART, "y", [Object.otu_ids]);
                Plotly.restyle(barCHART, "text", [Object.otu_labels]);
            
            } 
        });

        //loop through data to print demo data
        metadata.forEach(Object=>{
            if(Object.id == value){

                var metadata_location = d3.select("#sample-metadata");

                metadata_location.html("");

                var optionmeta = metadata_location.append("p");
                optionmeta.text(`Sample ID: ${Object.id}`);
                var optionmeta = metadata_location.append("p");
                optionmeta.text(`Sex: ${Object.gender}`);
                var optionmeta = metadata_location.append("p");
                optionmeta.text(`Age: ${Object.age}`);
                var optionmeta = metadata_location.append("p");
                optionmeta.text(`Location: ${Object.location}`);
                var optionmeta = metadata_location.append("p");
                optionmeta.text(`Ethnicity: ${Object.ethnicity}`);
                var optionmeta = metadata_location.append("p");
                optionmeta.text(`bbtype: ${Object.bbtype}`);
                var optionmeta = metadata_location.append("p");
                optionmeta.text(`wfreq: ${Object.wfreq}`);

                
            } 
        });

        //loop through data to restyle bubble chart
        bub_data.forEach(Object=>{
            if(Object.id == value){

                var bubCHART = d3.selectAll("#bubble").node();

                Plotly.restyle(bubCHART, "x", [Object.otu_ids]);
                Plotly.restyle(bubCHART, "y", [Object.sample_values]);
                Plotly.restyle(bubCHART, "text", [Object.otu_labels]);
                var newMarker={
                    size: Object.sample_values,
                    color: Object.otu_ids
                };
                Plotly.restyle(bubCHART, "marker", [newMarker]);
            
            } 
        });

    }

});