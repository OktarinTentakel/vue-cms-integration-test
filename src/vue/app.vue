<!-- APP COMPONENT -->



<template>
	<main id="app">
		<filter-form :filters="model.filters"/>
		<download-list :downloads="model.downloads"/>
	</main>
</template>



<script>
	import FilterForm from "./components/filter-form.vue";
	import DownloadList from 'components/download-list.vue';

	export default {
		data(){
			return {
				model : window.MODEL
			};
		},
		components: {FilterForm, DownloadList}
	}
</script>
