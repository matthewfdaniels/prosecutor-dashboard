<template>
  <div class="view">
    <Sidebar :topics="topics" :topicId="topicId"></Sidebar>
      <section class="main">
        <div ref="graphGroup" id="graphGroup">
          <h2>{{currentTitle}}</h2>
          <LineGraph class="graph"
                      v-if="!loadingData"
                      v-show="currentType !='map'"
                     :dataset="chartData"
                     :xLabel="currentXLabel"
                     :yLabel="currentYLabel"
                     :timelineMode="currentXLabel.includes('Year')"
                     :barMode="currentType !='line'">
          </LineGraph>

          <Map v-if="currentType=='map'" class="map"/>

          <Legend class="legend"
                  :title="currentLegendTitle"
                  :dataset="legendData">
          </Legend>

        </div>
        <Details
                ref="details"
                class="details"
                :filters="filters"
                :downloadSection="getDownloadSection"
                @filterChanged="updateFilter"
                @dateChanged="updateDate"
                @showFilter="showFilter"
                @capture="capture">
      </Details>
      </section>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar"
import LineGraph from "@/components/LineGraph"
import Details from "@/components/details/Details"
import Legend from "@/components/Legend"
import Map from "@/components/Map"

// import Models from "../utils/models.js"
import topicsJson from "../../assets/topics.json"
import filterJson from "../../assets/data/warrant-filters.json"
import Asset from "@/utils/assets"
import Text from "@/utils/text"
import { mapGetters } from "vuex"
import { Vue, VueElement } from 'vue'

import domtoimage from 'dom-to-image-more'

export default {
  name: "Dashboard",
  components: { Sidebar, LineGraph, Details, Legend, Map },
  props:{
    topicId: String
  },
  data(){
    return {
      colors: ["#6979D3", "#FFA600", "#7b247d", "#33557d", "#f5e16e", "#DD5182", "#44279c", "#b670b8" ],
      chartData: [],
      legendData: [],
      currentFilter: null, //object
      currentTopic: null, //object
      topics: topicsJson,
      filters: null,
      loadingData: false,
      adjustedDate: false,
    }
  },
  computed:{
    ...mapGetters({
      langId: "text/langId",
    }),
    getDownloadSection(){
      if (this.$ref && this.$ref.graphGroup){
        return this.$ref.graphGroup;
      }
      else{
        return null;
      }
    },
    currentLegendTitle(){
      if (this.currentFilter && this.currentFilter.label){
        return this.currentFilter.label;
      }
      return "";
    },
    currentTitle(){
      if (this.currentFilter && this.currentFilter.title){
        return this.currentFilter.title;
      }
      return "";
    },
    currentXLabel(){
      if (this.currentFilter && this.currentFilter.xLabel){
        return this.getText(this.currentFilter.xLabel);
      }
      return "";
    },
    currentYLabel(){
      if (this.currentFilter && this.currentFilter.yLabel){
        return this.getText(this.currentFilter.yLabel);
      }
      return "";
    },
    currentType(){
      if (this.currentFilter && this.currentFilter.type){
        return this.currentFilter.type;
      }
      return "";
    }
  },
  methods:{
    resetButtons(){
        //this.header = "changed header";

        this.emitter.emit("resetFilter");
    },
    getText(model){
      return Text.get(model, this.langId);
    },
    icon(file){
      return Asset.load("icons/" + file);
    },
    updateTopic(topic){
      this.currentTopic = topic;
      this.loadFilters();
      this.sort();
    },
    loadFilters(){
      // this.filters = Models.loadFilterModel(this.currentTopic);
      // var currentFilterKey = Object.keys(this.filters)[0]
      // this.currentFilter = this.filters[currentFilterKey];
      // console.log("currentFilter: " + this.currentFilter);
    },
    updateFilter(filter){
      this.adjustedDate = false;
      this.currentFilter = filter;
      this.sort();
    },
    updateDate(dateModel){
      console.log(dateModel);
      if (this.adjustedDate){
        if (dateModel.start && dateModel.end){
          // var currentData = Models.getByDate(dateModel);
          // this.chartData = [];

          // setTimeout(() => {
          //   var chart = [];
          //   var index = 0;
          //   for (var type in currentData){
          //     chart.push( {"data" : currentData[type], "borderColor": this.colors[index]})
          //     index++;
          //   }
          //   this.chartData = chart;
          // }, 5);

        }
      }

      setTimeout(() => {
        this.adjustedDate = true;
      }, 10);

    },
    showFilter(filterView){ //currently fixing bug where graph data is cleared out when filters are first shown
      if (filterView){
        this.initialize();
        this.resetButtons();
        //this.currentTopic = this.topics[this.topicId];
      }
    },
    sort(){
      // this.loadingData = true;
      // var dataFile = this.currentFilter.data;

      // var x = this.currentFilter.x;
      // var y = this.currentFilter.y;

      // console.log("sorting by: " + x + ", " + y)
      // var currentData = Models.getDataBy(dataFile, x, y);

      // var chart = [];
      // var legend = [];
      // var index = 0;
      // for (var type in currentData){
      //   chart.push( {"data" : currentData[type], "borderColor": this.colors[index], "backgroundColor": this.colors[index]})
      //   legend.push({"label" : type, "color" : this.colors[index]})
      //   index++;
      // }

      // this.chartData = chart;
      // this.legendData = legend;

      // console.log("display type: " + this.currentType);
      // this.loadingData = false;

      //console.log(this.chartData);
    },

    initialize(){
      this.loadingData = true;

      console.log("topicId: " + this.topicId)
      if (this.topicId === undefined){

        var firstTopic = Object.keys(this.topics)[0]
        console.log("topicId is null, defaulting to first topic: " + firstTopic)
        var nextPath = "/dashboard/" + firstTopic
        console.log("nextPath: " + nextPath)

        this.$router.push({ path: nextPath })
        //
        // setTimeout(() => {
        //   console.log("reload!")
        //   if (this.topicId !== undefined){
        //     console.log("next topicId: " + this.topicId);
        //     this.initialize();
        //   }
        // }, 500);
        //
        //

        return;
      }
      else{
        this.currentTopic = this.topics[this.topicId];
      }

      //console.log("currentTopic model: " + this.currentModel)
      this.loadFilters();
      this.sort();
    },

    async capture(imageName) {

      domtoimage
        .toPng(this.$refs.graphGroup)
        .then(function (dataUrl) {
          //console.log(dataUrl);
          var link = document.createElement('a');
          link.download = imageName + '.jpeg';
          link.href = dataUrl;
          link.click();


        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }
  },
  watch: {
    topicId (to, from){
      this.initialize();
    }
  },
  mounted(){
    this.initialize();
    this.emitter.emit("resetFilter");
  },

}

</script>

<style lang="scss" scoped>
@import "@/styles/main.scss";

.main{
  margin-left: 14rem;
  margin-top: 4rem;
}

h2{
  margin: 1.5rem 0 0 4rem;
  display: inline-block;

}

#graphGroup{
  background-color: $color-white;
}

.graph{
  display: inline-block;
  min-width: 300px;
  width: 75%;
  min-height: 200px;
  height: 43vh;
  padding-top: 2rem;
  padding-bottom: 3vh;


}
.map{
  display: inline-block;
  min-width: 300px;
  height: 45vh;
  width: 70%;
  min-height: 400px;
  height: 50vh;
  padding-left: 4rem;
  padding-top: 1rem;
  padding-bottom: 1vh;
  margin-bottom: 5px;

}

.legend{
  display: inline-block;
  width: 150px;
  vertical-align: top;
  padding-left: 2rem;
}

.downloadButton{
  width: 2rem;
  height: 2rem;
  left: 3rem;
  bottom: 3rem;

  img{
    width: 100%;
    height: 100%;
  }
}

.details{
  min-width: 300px;
  width: 75%;
  min-height: 150px;
  height: 25vh;
  padding-bottom: 7rem;
  padding-left: 2rem;
}

</style>
