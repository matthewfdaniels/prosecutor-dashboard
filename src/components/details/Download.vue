<template>
    <div class="download">
      <div class="typeGroup">
        <h4>Download Type</h4>
        <button v-for="(fileType, key) in fileTypes"
                :class="['fileType', fileType == currentFileType ? 'selected' : '']"
                @click="press(fileType)">
          <div :class="['circle', fileType == currentFileType ? 'selected' : '']"></div>
          {{ fileType }}

        </button>
      </div>

      <div class="downloadGroup">
        <button class="pill" @click="downloadData"> Download </button>
        <a id="downloadAnchorElem" style="display:none" ></a>
      </div>
    </div>
</template>

<script>
// import Models from "../../utils/models.js"
import domtoimage from 'dom-to-image-more';

export default {
  props: {
    downloadSection: Object
  },
  data(){
    return {
      currentFileType: "json",
      fileTypes: ["json", "csv", "screenshot"]
    }
  },
  methods:{
    press(next){
      this.currentFileType = next;
    },

    downloadData(){
      if (this.currentFileType === "screenshot"){
        this.$emit('capture', 'imageName')
      }
      else{
        // var data = Models.getCurrentModel();
        // var dataStr = "data:text/" + this.currentFileType + ";charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        // var dlAnchorElem = document.getElementById('downloadAnchorElem');
        // dlAnchorElem.setAttribute("href",     dataStr     );
        // dlAnchorElem.setAttribute("download", "data." + this.currentFileType);
        // dlAnchorElem.click();
      }
    }

  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/main.scss";



.typeGroup{
  display: inline-block;
  vertical-align: top;
  width: 50%;
  //margin: 0 1rem;
}

.downloadGroup{
  display: inline-block;
  vertical-align: top;
  width: 40%;
  //margin: 0 1rem;
}

.fileType{
  display: inline-block;
  color: $color-medium-grey;
  width: 100%;
  text-align: left;
  margin-bottom: 2px;
  list-style: none;
  vertical-align: middle;

  &.selected{
    color: $color-black;
  }

  .circle{
    display: inline-block;
    vertical-align: middle;
    background-color: transparent;
    width: 1rem;
    height: 1rem;
    border-radius: 30px;
    border: 2px $color-green solid;
    margin-left: -10px;

    &.selected{
      background-color: $color-green;
    }
  }
}

</style>
