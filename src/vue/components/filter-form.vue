<!-- FILTER FORM COMPONENT -->



<template>
	<form class="filter-form">
		<filter-select v-for="(filter, index) in filters" :key="index" :filter="filter"/>
	</form>
</template>



<script>
	import EventBus from 'vue-event-bus';
	import FilterSelect from 'components/filter-select.vue';

	export default {
		components: {FilterSelect},
		props : {
			filters : {
				required : true,
				type : Array
			}
		},
		data(){
			return {
				filterValues : {}
			};
		},
		mounted(){
			EventBus.$on('filter-changed', (payload) => {
				if( !payload.value ){
					delete this.filterValues[payload.name];
				} else {
					this.filterValues[payload.name] = payload.value;
				}

				EventBus.$emit('filters-changed', {filters : this.filterValues});
			});
		}
	}
</script>
