<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<style>
    #app{
        overflow: visible;
    }
    * { touch-action: pan-y; }
    body {
        font-family: 'PingFangSC-Medium', 'Microsoft YaHei', 'heiti TC', Arial, Helvetica, SimSun, Sans-serif
    }
	@import '../static/css/page.css';
    @import '../static/css/animate.min.css';
    @import '../static/css/fonts.css';
</style>
