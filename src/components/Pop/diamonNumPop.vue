<template>
   <div class="myCapsule">
        <div class="capsule_wrap">
          <i class="icon-diamon"></i>
          <span class="capsule-left-num">17.2k</span>
          <i class="capsule-right-icon"></i>
        </div>
      </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
.myCapsule {
  z-index:222;
       position: absolute;
      top: 13px;
      right: 0;
      display: inline-block;
      .capsule_wrap {
        min-width: 40px;
        height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        background-color: #fff;
        border: 2px solid #F96D56;
        border-radius: 36px;
        padding: 0 8px;
        margin-right: 10px;
      }
      .icon-diamon {
         width: 26px;
         height: 26px;
         background-image: url("~@/assets/img/icon_diamond_3.png");
         background-size: contain;
      }
      .capsule-right-icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("~@/assets/img/icon_add.png");
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
