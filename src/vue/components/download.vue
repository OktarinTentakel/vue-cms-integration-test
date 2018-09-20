<!-- DOWNLOAD COMPONENT -->



<template>
	<a
		class="download"
		:href="download.url"
		target="_blank"
	>
		<picture class="image">
			<source
				:srcset="download.image.sources.desktop"
				media="(min-width: 1024px)"
			/>
			<source
				:srcset="download.image.sources.tablet"
				media="(min-width: 768px)"
			/>
			<img
				:srcset="download.image.sources.mobile"
				:src="download.image.sources.mobile"
				:alt="download.image.alt"
			/>
		</picture>
		<span class="subheadline">{{ download.subheadline }}</span>
		<span class="headline">{{ download.headline }}</span>
	</a>
</template>



<script>
	export default {
		props : {
			download : {
				type : Object,
				required : true
			}
		}
	}
</script>
