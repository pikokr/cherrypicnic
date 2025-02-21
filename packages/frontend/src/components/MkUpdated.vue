<!--
SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkModal v-if="!showChangelog" ref="modal" :zPriority="'middle'" @closed="$emit('closed')">
	<div :class="$style.root">
		<div :class="$style.title"><MkSparkle>{{ i18n.ts.misskeyUpdated }}</MkSparkle></div>
		<div :class="$style.version">
			<div>✨{{ version }}🚀</div>
			<div style="font-size: 0.8em;">{{ basedMisskeyVersion }}</div>
		</div>
		<MkButton rounded full @click="showChangelog = true; modal.value.close();">{{ i18n.ts.whatIsNew }}</MkButton>
		<MkButton :class="$style.gotIt" primary rounded full @click="close">{{ i18n.ts.gotIt }}</MkButton>
	</div>
</MkModal>
<MkModal v-else-if="showChangelog" ref="modal" :zPriority="'middle'" @closed="$emit('closed')">
	<div :class="$style.root">
		<div :class="$style.title" style="margin: 0 0 1.5em; font-weight: normal;">{{ i18n.ts.whatIsNew }}</div>
		<MkButton rounded full @click="whatIsNewMisskey">Misskey</MkButton>
		<MkButton rounded full style="margin: 8px 0 0;" @click="whatIsNewCherryPick">CherryPick</MkButton>
		<MkButton :class="$style.gotIt" primary rounded full @click="close">{{ i18n.ts.ok }}</MkButton>
	</div>
</MkModal>
</template>

<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue';
import MkModal from '@/components/MkModal.vue';
import MkButton from '@/components/MkButton.vue';
import MkSparkle from '@/components/MkSparkle.vue';
import { version, basedMisskeyVersion } from '@/config.js';
import { i18n } from '@/i18n.js';
import { confetti } from '@/scripts/confetti.js';
import { unisonReload } from '@/scripts/unison-reload.js';
import * as os from '@/os.js';
import { miLocalStorage } from '@/local-storage.js';
import { fetchCustomEmojis } from '@/custom-emojis.js';

let showChangelog = $ref(false);

const modal = shallowRef<InstanceType<typeof MkModal>>();

const whatIsNewMisskey = () => {
	// modal.value.close();
	window.open(`https://misskey-hub.net/docs/releases.html#_${basedMisskeyVersion.replace(/\./g, '-')}`, '_blank');
};

const whatIsNewCherryPick = () => {
	// modal.value.close();
	window.open(`https://github.com/kokonect-link/cherrypick/blob/develop/CHANGELOG_CHERRYPICK.md#${version.replace(/\./g, '')}`, '_blank');
};

const close = async () => {
	modal.value.close();
	const { canceled } = await os.confirm({
		type: 'info',
		title: i18n.ts.cherrypickUpdatedCacheClearTitle,
		text: i18n.ts.cherrypickUpdatedCacheClear,
	});
	if (canceled) {
		await os.alert({
			type: 'info',
			text: i18n.ts.cherrypickUpdatedCacheClearLater,
		});
		return;
	}
	cacheClear();
};

function cacheClear() {
	os.waiting();
	miLocalStorage.removeItem('locale');
	miLocalStorage.removeItem('theme');
	miLocalStorage.removeItem('emojis');
	miLocalStorage.removeItem('lastEmojisFetchedAt');
	fetchCustomEmojis(true);
	unisonReload();
}

onMounted(() => {
	confetti({
		duration: 1000 * 3,
	});
});
</script>

<style lang="scss" module>
.root {
	margin: auto;
	position: relative;
	padding: 32px;
	min-width: 320px;
	max-width: 480px;
	box-sizing: border-box;
	text-align: center;
	background: var(--panel);
	border-radius: var(--radius);
}

.title {
	font-weight: bold;
}

.version {
	margin: 1em 0;
}

.gotIt {
	margin: 8px 0 0 0;
}

.cacheClear {
	composes: gotIt;
}
</style>
