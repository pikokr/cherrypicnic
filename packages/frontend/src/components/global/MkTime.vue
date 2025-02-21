<!--
SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<time v-tooltip="mode === 'detail' ? absolute : mode === 'relative' ? absolute : relative" :class="{ [$style.old1]: colored && (ago > 60 * 60 * 24 * 90), [$style.old2]: colored && (ago > 60 * 60 * 24 * 180) }">
	<template v-if="invalid">{{ i18n.ts._ago.invalid }}</template>
	<template v-else-if="mode === 'relative'">{{ relative }}</template>
	<template v-else-if="mode === 'absolute'">{{ absolute }}</template>
	<template v-else-if="mode === 'detail'">{{ absolute }} ({{ relative }})</template>
</time>
</template>

<script lang="ts" setup>
import isChromatic from 'chromatic/isChromatic';
import { onMounted, onUnmounted } from 'vue';
import { i18n } from '@/i18n.js';
import { dateTimeFormat } from '@/scripts/intl-const.js';
import { defaultStore } from '@/store.js';

const props = withDefaults(defineProps<{
	time: Date | string | number | null;
	origin?: Date | null;
	mode?: 'relative' | 'absolute' | 'detail';
	colored?: boolean;
}>(), {
	origin: isChromatic() ? new Date('2023-04-01T00:00:00Z') : null,
	mode: 'relative',
});

const _time = props.time == null ? NaN :
	typeof props.time === 'number' ? props.time :
	(props.time instanceof Date ? props.time : new Date(props.time)).getTime();
const invalid = Number.isNaN(_time);
const absolute = !invalid ? dateTimeFormat.format(_time) : i18n.ts._ago.invalid;

let now = $ref((props.origin ?? new Date()).getTime());
const ago = $computed(() => (now - _time) / 1000/*ms*/);

const relative = $computed<string>(() => {
	// if (props.mode === 'absolute') return ''; // absoluteではrelativeを使わないので計算しない
	if (invalid) return i18n.ts._ago.invalid;

	if (defaultStore.state.enableMarkByDate) {
		return (
			ago >= 86400 ? i18n.t('_ago.daysAgo', { n: Math.round(ago / 86400).toString() }) :
			ago >= 3600 ? i18n.t('_ago.hoursAgo', { n: Math.round(ago / 3600).toString() }) :
			ago >= 60 ? i18n.t('_ago.minutesAgo', { n: (~~(ago / 60)).toString() }) :
			ago >= 10 ? i18n.t('_ago.secondsAgo', { n: (~~(ago % 60)).toString() }) :
			ago >= -1 ? i18n.ts._ago.justNow :
			i18n.ts._ago.future);
	} else {
		return (
			ago >= 31536000 ? i18n.t('_ago.yearsAgo', { n: Math.round(ago / 31536000).toString() }) :
			ago >= 2592000 ? i18n.t('_ago.monthsAgo', { n: Math.round(ago / 2592000).toString() }) :
			ago >= 604800 ? i18n.t('_ago.weeksAgo', { n: Math.round(ago / 604800).toString() }) :
			ago >= 86400 ? i18n.t('_ago.daysAgo', { n: Math.round(ago / 86400).toString() }) :
			ago >= 3600 ? i18n.t('_ago.hoursAgo', { n: Math.round(ago / 3600).toString() }) :
			ago >= 60 ? i18n.t('_ago.minutesAgo', { n: (~~(ago / 60)).toString() }) :
			ago >= 10 ? i18n.t('_ago.secondsAgo', { n: (~~(ago % 60)).toString() }) :
			ago >= -1 ? i18n.ts._ago.justNow :
			i18n.ts._ago.future);
	}
});

let tickId: number;
let currentInterval: number;

function tick() {
	now = (new Date()).getTime();
	const nextInterval = ago < 60 ? 10000 : ago < 3600 ? 60000 : 180000;

	if (currentInterval !== nextInterval) {
		if (tickId) window.clearInterval(tickId);
		currentInterval = nextInterval;
		tickId = window.setInterval(tick, nextInterval);
	}
}

if (!invalid && props.origin === null && (props.mode === 'relative' || props.mode === 'detail')) {
	onMounted(() => {
		tick();
	});
	onUnmounted(() => {
		if (tickId) window.clearInterval(tickId);
	});
}
</script>

<style lang="scss" module>
.old1 {
	color: var(--warn);
}

.old1.old2 {
	color: var(--error);
}
</style>
