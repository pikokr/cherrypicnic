<!--
SPDX-FileCopyrightText: syuilo and noridev and other misskey, cherrypick contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<button class="_button" :class="$style.root" @mousedown="toggle">
	<b>{{ modelValue ? i18n.ts._cw.hide : i18n.ts._cw.show }}</b>
	<span v-if="!modelValue" :class="$style.label">{{ label }}</span>
</button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import * as Misskey from 'cherrypick-js';
import { concat } from '@/scripts/array.js';
import { i18n } from '@/i18n.js';

const props = defineProps<{
	modelValue: boolean;
	note: Misskey.entities.Note;
}>();

const emit = defineEmits<{
	(ev: 'update:modelValue', v: boolean): void;
}>();

const label = computed(() => {
	return concat([
		props.note.files && props.note.files.length !== 0 ? [i18n.t('withNFiles', { n: props.note.files.length })] : [],
		props.note.poll != null ? [i18n.ts.poll] : [],
	] as string[][]).join(' / ');
});

const toggle = () => {
	emit('update:modelValue', !props.modelValue);
};
</script>

<style lang="scss" module>
.root {
	display: inline-block;
	margin: 5px 0;
	padding: 6px;
	font-size: 0.7em;
	color: var(--cwFg);
	background: var(--cwBg);
	border-radius: 5px;
	transition: background-color .25s ease-in-out;

	&:hover {
		color: var(--cwBg);
		background: var(--panel);
	}
}

.label {
	margin-left: 4px;

	&:before {
		content: '(';
	}

	&:after {
		content: ')';
	}
}
</style>
