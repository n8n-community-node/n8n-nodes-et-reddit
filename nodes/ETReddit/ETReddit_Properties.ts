import { INodeProperties } from "n8n-workflow";

export const properties = {

	// ------------------------------------------------------------------
	resources: {
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Post',
				value: 'post',
			},
			{
				name: 'Post Comment',
				value: 'postComment',
			},
			{
				name: 'Profile',
				value: 'profile',
			},
			{
				name: 'Subreddit',
				value: 'subreddit',
			},
			{
				name: 'User',
				value: 'user',
			},
		],
		default: 'post',
	} as INodeProperties,

	// ------------------------------------------------------------------
	postComment: {
		operations: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'create',
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a top-level comment in a post',
						action: 'Create a comment in a post',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Retrieve many comments in a post',
						action: 'Get many comments in a post',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Remove a comment from a post',
						action: 'Delete a comment from a post',
					},
					{
						name: 'Reply',
						value: 'reply',
						description: 'Write a reply to a comment in a post',
						action: 'Reply to a comment in a post',
					},
				],
				displayOptions: {
					show: {
						resource: ['postComment'],
					},
				},
			},
		] as INodeProperties[],
		fields: [
			// ----------------------------------
			//        postComment: create
			// ----------------------------------
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				required: true,
				default: '',
				description:
					'ID of the post to write the comment to. Found in the post URL: <code>/r/[subreddit_name]/comments/[post_id]/[post_title]</code>',
				placeholder: 'l0me7x',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Comment Text',
				name: 'commentText',
				type: 'string',
				required: true,
				default: '',
				description: 'Text of the comment. Markdown supported.',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['create'],
					},
				},
			},
		
			// ----------------------------------
			//        postComment: getAll
			// ----------------------------------
			{
				displayName: 'Subreddit',
				name: 'subreddit',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of subreddit where the post is',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				required: true,
				default: '',
				description:
					'ID of the post to get all comments from. Found in the post URL: <code>/r/[subreddit_name]/comments/[post_id]/[post_title]</code>',
				placeholder: 'l0me7x',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
			},
		
			// ----------------------------------
			//        postComment: delete
			// ----------------------------------
			{
				displayName: 'Comment ID',
				name: 'commentId',
				type: 'string',
				required: true,
				default: '',
				description:
					'ID of the comment to remove. Found in the comment URL:<code>/r/[subreddit_name]/comments/[post_id]/[post_title]/[comment_id]</code>',
				placeholder: 'gla7fmt',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['delete'],
					},
				},
			},
		
			// ----------------------------------
			//        postComment: reply
			// ----------------------------------
			{
				displayName: 'Comment ID',
				name: 'commentId',
				type: 'string',
				required: true,
				default: '',
				description:
					'ID of the comment to reply to. To be found in the comment URL: <code>www.reddit.com/r/[subreddit_name]/comments/[post_id]/[post_title]/[comment_id]</code>',
				placeholder: 'gl9iroa',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['reply'],
					},
				},
			},
			{
				displayName: 'Reply Text',
				name: 'replyText',
				type: 'string',
				required: true,
				default: '',
				description: 'Text of the reply. Markdown supported.',
				displayOptions: {
					show: {
						resource: ['postComment'],
						operation: ['reply'],
					},
				},
			},
		] as INodeProperties[],
	},

	// ------------------------------------------------------------------
	profile: {
		operations: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['profile'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a profile',
					},
				],
				default: 'get',
			},
		] as INodeProperties[],
		fields: [
			{
				displayName: 'Details',
				name: 'details',
				type: 'options',
				required: true,
				default: 'identity',
				description: 'Details of my account to retrieve',
				options: [
					{
						name: 'Blocked Users',
						value: 'blockedUsers',
						description: 'Return the blocked users of the logged-in user',
					},
					{
						name: 'Friends',
						value: 'friends',
						description: 'Return the friends of the logged-in user',
					},
					{
						name: 'Identity',
						value: 'identity',
						description: 'Return the identity of the logged-in user',
					},
					{
						name: 'Karma',
						value: 'karma',
						description: 'Return the subreddit karma for the logged-in user',
					},
					{
						name: 'Preferences',
						value: 'prefs',
						description: 'Return the settings preferences of the logged-in user',
					},
					{
						name: 'Saved',
						value: 'saved',
						description: 'Return the saved posts for the user',
					},
					{
						name: 'Trophies',
						value: 'trophies',
						description: 'Return the trophies of the logged-in user',
					},
				],
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['get'],
						details: ['saved'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['get'],
						details: ['saved'],
						returnAll: [false],
					},
				},
			},
		] as INodeProperties[],
	},

	// ------------------------------------------------------------------
	subreddit: {
		operations: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'get',
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Retrieve background information about a subreddit',
						action: 'Get a subreddit',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Retrieve information about many subreddits',
						action: 'Get many subreddits',
					},
				],
				displayOptions: {
					show: {
						resource: ['subreddit'],
					},
				},
			},
		] as INodeProperties[],
		fields: [
			// ----------------------------------
			//         subreddit: get
			// ----------------------------------
			{
				displayName: 'Content',
				name: 'content',
				type: 'options',
				required: true,
				default: 'about',
				description: 'Subreddit content to retrieve',
				options: [
					{
						name: 'About',
						value: 'about',
					},
					{
						name: 'Rules',
						value: 'rules',
					},
				],
				displayOptions: {
					show: {
						resource: ['subreddit'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Subreddit',
				name: 'subreddit',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of subreddit to retrieve the content from',
				displayOptions: {
					show: {
						resource: ['subreddit'],
						operation: ['get'],
					},
				},
			},
		
			// ----------------------------------
			//        subreddit: getAll
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						resource: ['subreddit'],
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						resource: ['subreddit'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Keyword',
						name: 'keyword',
						type: 'string',
						default: '',
						description: 'The keyword for the subreddit search',
					},
					{
						displayName: 'Trending',
						name: 'trending',
						type: 'boolean',
						default: false,
						description: 'Whether to fetch currently trending subreddits in all of Reddit',
					},
				],
				displayOptions: {
					show: {
						resource: ['subreddit'],
						operation: ['getAll'],
					},
				},
			},
		] as INodeProperties[],
	},

	// ------------------------------------------------------------------
	post: {
		operations:  [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'create',
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Submit a post to a subreddit',
						action: 'Create a post',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a post from a subreddit',
						action: 'Delete a post',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a post from a subreddit',
						action: 'Get a post',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many posts from a subreddit',
						action: 'Get many posts',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search posts in a subreddit or in all of Reddit',
						action: 'Search for a post',
					},
				],
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
			},
		] as INodeProperties[],
		fields: [
			// ----------------------------------
			//         post: create
			// ----------------------------------
			{
				displayName: 'Subreddit',
				name: 'subreddit',
				type: 'string',
				required: true,
				default: '',
				description: 'Subreddit to create the post in',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Kind',
				name: 'kind',
				type: 'options',
				options: [
					{
						name: 'Text Post',
						value: 'self',
					},
					{
						name: 'Link Post',
						value: 'link',
					},
					{
						name: 'Image Post',
						value: 'image',
					},
				],
				default: 'self',
				description: 'The kind of the post to create',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				description: 'Title of the post, up to 300 characters long',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
					},
				},
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				description: 'URL of the post',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
						kind: ['link', 'image'],
					},
				},
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				default: '',
				description: 'Text of the post. Markdown supported.',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
						kind: ['self'],
					},
				},
			},
			{
				displayName: 'Resubmit',
				name: 'resubmit',
				type: 'boolean',
				default: false,
				description:
					'Whether the URL will be posted even if it was already posted to the subreddit before. Otherwise, the re-posting will trigger an error.',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
						kind: ['link', 'image'],
					},
				},
			},
		
			// ----------------------------------
			//           post: delete
			// ----------------------------------
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				required: true,
				default: '',
				description:
					'ID of the post to delete. Found in the post URL: <code>/r/[subreddit_name]/comments/[post_id]/[post_title]</code>',
				placeholder: 'gla7fmt',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['delete'],
					},
				},
			},
		
			// ----------------------------------
			//           post: get
			// ----------------------------------
			{
				displayName: 'Subreddit',
				name: 'subreddit',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of subreddit to retrieve the post from',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'string',
				required: true,
				default: '',
				description:
					'ID of the post to retrieve. Found in the post URL: <code>/r/[subreddit_name]/comments/[post_id]/[post_title]</code>',
				placeholder: 'l0me7x',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['get'],
					},
				},
			},
		
			// ----------------------------------
			//         post: getAll
			// ----------------------------------
			{
				displayName: 'Subreddit',
				name: 'subreddit',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of subreddit to retrieve the posts from',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
					},
				},
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Category',
						name: 'category',
						type: 'options',
						default: 'top',
						description: 'Category of the posts to retrieve',
						options: [
							{
								name: 'Top Posts',
								value: 'top',
							},
							{
								name: 'Hot Posts',
								value: 'hot',
							},
							{
								name: 'New Posts',
								value: 'new',
							},
							{
								name: 'Rising Posts',
								value: 'rising',
							},
						],
					},
				],
			},
		
			// ----------------------------------
			//         post: search
			// ----------------------------------
			{
				displayName: 'Location',
				name: 'location',
				type: 'options',
				default: 'subreddit',
				description: 'Location where to search for posts',
				options: [
					{
						name: 'All Reddit',
						value: 'allReddit',
						description: 'Search for posts in all of Reddit',
					},
					{
						name: 'Subreddit',
						value: 'subreddit',
						description: 'Search for posts in a specific subreddit',
					},
				],
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Subreddit',
				name: 'subreddit',
				type: 'string',
				required: true,
				default: '',
				description: 'The name of subreddit to search in',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['search'],
						location: ['subreddit'],
					},
				},
			},
			{
				displayName: 'Keyword',
				name: 'keyword',
				type: 'string',
				default: '',
				required: true,
				description: 'The keyword for the search',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['search'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Sort',
						name: 'sort',
						placeholder: '',
						type: 'options',
						default: 'relevance',
						description: 'The category to sort results by',
						options: [
							{
								name: 'Comments',
								value: 'comments',
							},
							{
								name: 'Hot',
								value: 'hot',
							},
							{
								name: 'New',
								value: 'new',
							},
							{
								name: 'Relevance',
								value: 'relevance',
							},
							{
								name: 'Top',
								value: 'top',
							},
						],
					},
				],
			},
		] as INodeProperties[];
	},

	// ------------------------------------------------------------------
	user: {
		operations: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a user',
					},
				],
				default: 'get',
			},
		] as INodeProperties[],
		fields: [
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				required: true,
				default: '',
				description: 'Reddit ID of the user to retrieve',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Details',
				name: 'details',
				type: 'options',
				required: true,
				default: 'about',
				description: 'Details of the user to retrieve',
				options: [
					{
						name: 'About',
						value: 'about',
					},
					{
						name: 'Comments',
						value: 'comments',
					},
					{
						name: 'Gilded',
						value: 'gilded',
					},
					{
						name: 'Overview',
						value: 'overview',
					},
					{
						name: 'Submitted',
						value: 'submitted',
					},
				],
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get'],
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get'],
						details: ['overview', 'submitted', 'comments', 'gilded'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get'],
						details: ['comments', 'gilded', 'overview', 'submitted'],
						returnAll: [false],
					},
				},
			},
		] as INodeProperties[],
	},
};