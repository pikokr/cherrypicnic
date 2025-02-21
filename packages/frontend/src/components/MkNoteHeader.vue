<!--
SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<header :class="$style.root">
	<div :class="$style.section">
		<div style="display: flex;">
			<MkA v-user-preview="note.user.id" :class="$style.name" :to="userPage(note.user)">
				<MkUserName :user="note.user"/>
			</MkA>
			<div v-if="note.user.isBot" :class="$style.isBot">bot</div>
			<div v-if="note.user.badgeRoles" :class="$style.badgeRoles">
				<img v-for="role in note.user.badgeRoles" :key="role.id" v-tooltip="role.name" :class="$style.badgeRole" :src="role.iconUrl"/>
			</div>
		</div>
		<div :class="$style.username"><MkAcct :user="note.user"/></div>
	</div>
	<div :class="$style.section">
		<div :class="$style.info">
			<span v-if="note.updatedAt" style="margin-right: 0.5em;" :title="i18n.ts.edited"><i class="ti ti-pencil"></i></span>
			<span v-if="note.visibility !== 'public'" style="margin-right: 0.5em;">
				<i v-if="note.visibility === 'home'" v-tooltip="i18n.ts._visibility[note.visibility]" class="ti ti-home"></i>
				<i v-else-if="note.visibility === 'followers'" v-tooltip="i18n.ts._visibility[note.visibility]" class="ti ti-lock"></i>
				<i v-else-if="note.visibility === 'specified'" ref="specified" v-tooltip="i18n.ts._visibility[note.visibility]" class="ti ti-mail"></i>
			</span>
			<span v-if="note.reactionAcceptance != null" style="margin-right: 0.5em;" :class="{ [$style.danger]: ['nonSensitiveOnly', 'nonSensitiveOnlyForLocalLikeOnlyForRemote', 'likeOnly'].includes(<string>note.reactionAcceptance) }" :title="i18n.ts.reactionAcceptance">
				<i v-if="note.reactionAcceptance === 'likeOnlyForRemote'" v-tooltip="i18n.ts.likeOnlyForRemote" class="ti ti-heart-plus"></i>
				<i v-else-if="note.reactionAcceptance === 'nonSensitiveOnly'" v-tooltip="i18n.ts.nonSensitiveOnly" class="ti ti-icons"></i>
				<i v-else-if="note.reactionAcceptance === 'nonSensitiveOnlyForLocalLikeOnlyForRemote'" v-tooltip="i18n.ts.nonSensitiveOnlyForLocalLikeOnlyForRemote" class="ti ti-heart-plus"></i>
				<i v-else-if="note.reactionAcceptance === 'likeOnly'" v-tooltip="i18n.ts.likeOnly" class="ti ti-heart"></i>
			</span>
			<span v-if="note.localOnly" style="margin-right: 0.5em;"><i v-tooltip="i18n.ts._visibility['disableFederation']" class="ti ti-rocket-off"></i></span>
			<span v-if="note.channel" style="margin-right: 0.5em;"><i v-tooltip="note.channel.name" class="ti ti-device-tv"></i></span>
			<MkA :class="$style.time" :to="notePage(note)">
				<MkTime v-if="defaultStore.state.enableAbsoluteTime" :time="note.createdAt" mode="absolute" colored/>
				<MkTime v-else-if="!defaultStore.state.enableAbsoluteTime" :time="note.createdAt" mode="relative" colored/>
			</MkA>
		</div>
		<div :style="$style.info"><MkInstanceTicker v-if="showTicker" :instance="note.user.instance"/></div>
	</div>
</header>
</template>

<script lang="ts" setup>
import { } from 'vue';
import * as Misskey from 'cherrypick-js';
import { i18n } from '@/i18n.js';
import { notePage } from '@/filters/note.js';
import { userPage } from '@/filters/user.js';
import { defaultStore } from '@/store.js';
import { deepClone } from '@/scripts/clone.js';
import MkInstanceTicker from '@/components/MkInstanceTicker.vue';

const props = defineProps<{
	note: Misskey.entities.Note;
}>();

let note = $ref(deepClone(props.note));

const showTicker = (defaultStore.state.instanceTicker === 'always') || (defaultStore.state.instanceTicker === 'remote' && note.user.instance);
</script>

<style lang="scss" module>
.root {
	display: flex;
}

.section {
	align-items: flex-start;
	white-space: nowrap;
	flex-direction: column;
	overflow: hidden;

	&:last-child {
		display: flex;
		align-items: flex-end;
		margin-left: auto;
		padding-left: 10px;
		overflow: clip;
	}
}

.name {
	flex-shrink: 1;
	display: block;
	margin: 0 .5em 0 0;
	padding: 0;
	overflow: scroll;
  overflow-wrap: anywhere;
	font-size: 1em;
	font-weight: bold;
	text-decoration: none;
	text-overflow: ellipsis;
	max-width: 300px;

  &::-webkit-scrollbar {
    display: none;
  }

	&:hover {
		color: var(--nameHover);
		text-decoration: none;
	}
}

.isBot {
	flex-shrink: 0;
	align-self: center;
	margin: 0 .5em 0 0;
	padding: 1px 6px;
	font-size: 80%;
	border: solid 0.5px var(--divider);
	border-radius: 3px;
}

.username {
	flex-shrink: 9999999;
	margin: 0 .5em 0 0;
	overflow: scroll;
	text-overflow: ellipsis;
	font-size: .95em;
  max-width: 300px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.info {
	flex-shrink: 0;
	margin-left: auto;
	font-size: 0.9em;
}

.time {
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
}

.badgeRoles {
	margin: 0 .5em 0 0;
}

.badgeRole {
	height: 1.3em;
	vertical-align: -20%;

	& + .badgeRole {
		margin-left: 0.2em;
	}
}

.danger {
	color: var(--accent);
}

@container (max-width: 500px) {
	.name, .username {
		max-width: 200px;
	}
}
</style>
