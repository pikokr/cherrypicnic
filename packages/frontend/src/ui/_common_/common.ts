/*
 * SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineAsyncComponent } from 'vue';
import type { MenuItem } from '@/types/menu.js';
import * as os from '@/os.js';
import { instance } from '@/instance.js';
import { host } from '@/config.js';
import { i18n } from '@/i18n.js';
import { $i } from '@/account.js';
import { defaultStore } from '@/store.js';
import { unisonReload } from '@/scripts/unison-reload.js';

function toolsMenuItems(): MenuItem[] {
	return [{
		type: 'link',
		to: '/scratchpad',
		text: i18n.ts.scratchpad,
		icon: 'ti ti-terminal-2',
	}, {
		type: 'link',
		to: '/api-console',
		text: 'API Console',
		icon: 'ti ti-terminal-2',
	}, {
		type: 'link',
		to: '/clicker',
		text: '🍪👈',
		icon: 'ti ti-cookie',
	}, ($i && ($i.isAdmin || $i.policies.canManageCustomEmojis)) ? {
		type: 'link',
		to: '/custom-emojis-manager',
		text: i18n.ts.manageCustomEmojis,
		icon: 'ti ti-icons',
	} : undefined, ($i && ($i.isAdmin || $i.policies.canManageAvatarDecorations)) ? {
		type: 'link',
		to: '/avatar-decorations',
		text: i18n.ts.manageAvatarDecorations,
		icon: 'ti ti-sparkles',
	} : undefined];
}

export function openInstanceMenu(ev: MouseEvent) {
	os.popupMenu([{
		text: instance.name ?? host,
		type: 'label',
	}, {
		type: 'link',
		text: i18n.ts.instanceInfo,
		icon: 'ti ti-info-circle',
		to: '/about',
	}, {
		type: 'link',
		text: i18n.ts.customEmojis,
		icon: 'ti ti-icons',
		to: '/about#emojis',
	}, {
		type: 'link',
		text: i18n.ts.federation,
		icon: 'ti ti-world',
		to: '/about#federation',
	}, {
		type: 'link',
		text: i18n.ts.charts,
		icon: 'ti ti-chart-line',
		to: '/about#charts',
	}, null, {
		type: 'link',
		text: i18n.ts.ads,
		icon: 'ti ti-ad',
		to: '/ads',
	}, ($i && ($i.isAdmin || $i.policies.canInvite) && instance.disableRegistration) ? {
		type: 'link',
		to: '/invite',
		text: i18n.ts.invite,
		icon: 'ti ti-user-plus',
	} : undefined, {
		type: 'parent',
		text: i18n.ts.tools,
		icon: 'ti ti-tool',
		children: toolsMenuItems(),
	}, null, (instance.impressumUrl) ? {
		text: i18n.ts.impressum,
		icon: 'ti ti-file-invoice',
		action: () => {
			window.open(instance.impressumUrl, '_blank');
		},
	} : undefined, (instance.tosUrl) ? {
		text: i18n.ts.termsOfService,
		icon: 'ti ti-notebook',
		action: () => {
			window.open(instance.tosUrl, '_blank');
		},
	} : undefined, (instance.privacyPolicyUrl) ? {
		text: i18n.ts.privacyPolicy,
		icon: 'ti ti-shield-lock',
		action: () => {
			window.open(instance.privacyPolicyUrl, '_blank');
		},
	} : undefined, (!instance.impressumUrl && !instance.tosUrl && !instance.privacyPolicyUrl) ? undefined : null, {
		type: 'parent',
		text: i18n.ts.help,
		icon: 'ti ti-help-circle',
		children: [{
			text: i18n.ts.help,
			icon: 'ti ti-help-circle',
			action: () => {
				window.open('https://misskey-hub.net/help.html', '_blank');
			},
		}, {
			type: 'link',
			text: i18n.ts._mfm.cheatSheet,
			icon: 'ti ti-help-circle',
			to: '/mfm-cheat-sheet',
		}, null, {
			type: 'button',
			text: i18n.ts.replayUserSetupDialog,
			icon: 'ti ti-list-numbers',
			action: () => {
				defaultStore.set('accountSetupWizard', 0);
				os.popup(defineAsyncComponent(() => import('@/components/MkUserSetupDialog.vue')), {}, {}, 'closed');
			},
		}, {
			type: 'button',
			text: i18n.ts.replayTutorial,
			icon: 'ti ti-checkup-list',
			action: () => {
				defaultStore.set('timelineTutorial', 0);
				defaultStore.set('tlHomeHintClosed', false);
				defaultStore.set('tlLocalHintClosed', false);
				defaultStore.set('tlSocialHintClosed', false);
				defaultStore.set('tlGlobalHintClosed', false);
				setTimeout(unisonReload, 100);
			},
		}],
	}, {
		type: 'link',
		text: i18n.ts.aboutMisskey,
		to: '/about-misskey',
	}], ev.currentTarget ?? ev.target, {
		align: 'left',
	});
}

export function openToolsMenu(ev: MouseEvent) {
	os.popupMenu(toolsMenuItems(), ev.currentTarget ?? ev.target, {
		align: 'left',
	});
}
