<!-- FILTER COMPONENT -->



<template>
	<select class="filter" :name="filter.name" v-model="value" @change="triggerUpdate">
		<option value="">{{ filter.placeholder }}</option>
		<option v-for="option in filter.options" :key="option.value" :value="option.value">{{ option.text }}</option>
	</select>
</template>



<script>
	import EventBus from 'vue-event-bus';

	export default {
		props : {
			filter : {
				type : Object,
				required : true
			}
		},
		data(){
			return {
				value : ''
			};
		},
		mounted(){
			M.FormSelect.init(this.$el, {});
		},
		methods : {
			triggerUpdate : function(){
				EventBus.$emit('filter-changed', {
					name : this.filter.name,
					value : this.value
				});
			}
		}
	}
</script>
