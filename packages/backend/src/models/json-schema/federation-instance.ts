/*
 * SPDX-FileCopyrightText: syuilo and other misskey, cherrypick contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const packedFederationInstanceSchema = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			optional: false, nullable: false,
			format: 'id',
		},
		firstRetrievedAt: {
			type: 'string',
			optional: false, nullable: false,
			format: 'date-time',
		},
		host: {
			type: 'string',
			optional: false, nullable: false,
			example: 'cherrypick.example.com',
		},
		usersCount: {
			type: 'number',
			optional: false, nullable: false,
		},
		notesCount: {
			type: 'number',
			optional: false, nullable: false,
		},
		followingCount: {
			type: 'number',
			optional: false, nullable: false,
		},
		followersCount: {
			type: 'number',
			optional: false, nullable: false,
		},
		isNotResponding: {
			type: 'boolean',
			optional: false, nullable: false,
		},
		isSuspended: {
			type: 'boolean',
			optional: false, nullable: false,
		},
		isBlocked: {
			type: 'boolean',
			optional: false, nullable: false,
		},
		softwareName: {
			type: 'string',
			optional: false, nullable: true,
			example: 'cherrypick',
		},
		softwareVersion: {
			type: 'string',
			optional: false, nullable: true,
		},
		openRegistrations: {
			type: 'boolean',
			optional: false, nullable: true,
			example: true,
		},
		name: {
			type: 'string',
			optional: false, nullable: true,
		},
		description: {
			type: 'string',
			optional: false, nullable: true,
		},
		maintainerName: {
			type: 'string',
			optional: false, nullable: true,
		},
		maintainerEmail: {
			type: 'string',
			optional: false, nullable: true,
		},
		iconUrl: {
			type: 'string',
			optional: false, nullable: true,
			format: 'url',
		},
		faviconUrl: {
			type: 'string',
			optional: false, nullable: true,
			format: 'url',
		},
		themeColor: {
			type: 'string',
			optional: false, nullable: true,
		},
		isSilenced: {
			type: 'boolean',
			optional: false,
			nullable: false,
		},
		infoUpdatedAt: {
			type: 'string',
			optional: false, nullable: true,
			format: 'date-time',
		},
	},
} as const;
