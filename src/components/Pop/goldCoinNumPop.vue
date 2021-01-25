<template>
   <div class="myCapsule">
        <div class="myCapsule_wrap">
          <i class="capsule-left-icon"></i>
          <span class="capsule-left-num">16.2k</span>
        </div>
      </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
.myCapsule {
       position: absolute;
      top: 13px;
      right: 0;
      display: inline-block;
      .myCapsule_wrap {
        min-width: 40px;
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        background-color: #fff;
        border: 2px solid #FFDA73;
        border-radius: 36px;
        padding: 0 8px;
        margin-right: 10px;
      }
      .capsule-left-icon {
         width: 26px;
         height: 26px;
         background-image: url("~@/assets/img/rank_gold.png");
         background-size: contain;
      }
      .capsule-left-num {
        display: inline-block;
        margin-right: 5px;
        margin-left: 1px;
        min-width: 15px;
        text-align: right;
        font-size: 15px;
        color: #4d4d4d;
        font-weight: bold;
      }
  }
</style>
