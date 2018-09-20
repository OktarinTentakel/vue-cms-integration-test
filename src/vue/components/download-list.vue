<!-- DOWNLOAD LIST COMPONENT -->



<template>
	<div class="download-list">
		<download v-for="(download, index) in currentDownloads" :key="index" :download="download"/>
	</div>
</template>



<script>
	import _ from 'lodash';
	import EventBus from 'vue-event-bus';
	import Download from 'components/download.vue';

	export default {
		components: {Download},
		props : {
			downloads : {
				required : true,
				type : Array
			}
		},
		data(){
			return {
				currentDownloads : JSON.parse(JSON.stringify(this.downloads))
			};
		},
		mounted(){
			EventBus.$on('filters-changed', (payload) => {
				let filters = payload.filters;

				this.currentDownloads = _.filter(this.downloads, function(download){
					let res = true;

					_.each(filters, (filterValue, filterName) => {
						if(
							!download.filterAttributes
							|| !download.filterAttributes[filterName]
							|| (!download.filterAttributes[filterName].value && !_.isArray(download.filterAttributes[filterName].values))
							|| ((filterValue !== download.filterAttributes[filterName].value) && !_.includes(download.filterAttributes[filterName].values, filterValue))
						){
							res = false;
							return false;
						}
					});

					return res;
				});
			});
		}
	}
</script>
