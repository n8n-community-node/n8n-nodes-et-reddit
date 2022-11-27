import { IBinaryKeyData, IDataObject, IExecuteFunctions, IHookFunctions, INodeExecutionData, JsonObject, NodeApiError, NodeExecutionWithMetadata, NodeOperationError, sleep } from "n8n-workflow";
import { OptionsWithUri, OptionsWithUrl } from "request-promise-native";
import { LoggerProxy as Logger } from "n8n-workflow";

export const methods = {

	// ------------------------------------------------------------------
	execute: async function execute(this: IExecuteFunctions, items: INodeExecutionData[], i: number): Promise<NodeExecutionWithMetadata[]> {

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const resourceOperation = `${resource}-${operation}`;

		try {
			let responseData;
			switch (resourceOperation) {
				case 'post-create':
					responseData = await createPost.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'post-delete':
					responseData = await deletePost.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'post-get':
					responseData = await getPost.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'post-getAll':
					responseData = await getAllPosts.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'post-seaerch':
					responseData = await searchPosts.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'postComment-create':
					responseData = await createPostComment.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'postComment-delete':
					responseData = await deletePostComment.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'postComment-getAll':
					responseData = await getAllPostComments.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'postComment-reply':
					responseData = await replyPostComment.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'profile-get':
					responseData = await getProfile.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'subreddit-get':
					responseData = await getSubreddit.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'subreddit-getAll':
					responseData = await getAllSubreddits.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				case 'user-get':
					responseData = await getUser.call(this, items, i);
					return getExecutionData.call(this, responseData, i);
				default:
					throw new Error(`The resource "${resource}" is not known!`);
			}
		} catch (error) {
			if (this.continueOnFail()) {
				const executionErrorData = {
					json: {
						error: (error as JsonObject).message,
					},
				} as unknown as NodeExecutionWithMetadata[];
				return executionErrorData;
			}
			throw error;
		}
	},
}

// ------------------------------------------------------------------
async function createPost(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//         post: create
	// ----------------------------------

	// https://www.reddit.com/dev/api/#POST_api_submit

	const qs: IDataObject = {
		title: this.getNodeParameter('title', i),
		sr: this.getNodeParameter('subreddit', i),
		kind: this.getNodeParameter('kind', i),
	};

	qs.kind === 'self'
		? (qs.text = this.getNodeParameter('text', i))
		: (qs.url = this.getNodeParameter('url', i));

	if (qs.url) {
		qs.resubmit = this.getNodeParameter('resubmit', i);
	}

	let responseData = await redditApiRequest.call(this, 'POST', 'api/submit', qs);
	responseData = responseData.json.data;
	return responseData;
}

// ------------------------------------------------------------------
async function deletePost(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//         post: delete
	// ----------------------------------

	// https://www.reddit.com/dev/api/#POST_api_del

	const postTypePrefix = 't3_';

	const qs: IDataObject = {
		id: postTypePrefix + this.getNodeParameter('postId', i),
	};

	await redditApiRequest.call(this, 'POST', 'api/del', qs);

	const responseData = { success: true };
	return responseData;
}

// ------------------------------------------------------------------
async function getPost(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//         post: get
	// ----------------------------------

	const subreddit = this.getNodeParameter('subreddit', i);
	const postId = this.getNodeParameter('postId', i) as string;
	const endpoint = `r/${subreddit}/comments/${postId}.json`;

	let responseData = await redditApiRequest.call(this, 'GET', endpoint, {});
	responseData = responseData[0].data.children[0].data;
	return responseData;
}

// ------------------------------------------------------------------
async function getAllPosts(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//         post: getAll
	// ----------------------------------

	// https://www.reddit.com/dev/api/#GET_hot
	// https://www.reddit.com/dev/api/#GET_new
	// https://www.reddit.com/dev/api/#GET_rising
	// https://www.reddit.com/dev/api/#GET_{sort}

	const subreddit = this.getNodeParameter('subreddit', i);
	let endpoint = `r/${subreddit}.json`;

	const { category } = this.getNodeParameter('filters', i) as { category: string };
	if (category) {
		endpoint = `r/${subreddit}/${category}.json`;
	}

	let responseData = await handleListing.call(this, i, endpoint);
	responseData = responseData.data.children;
	return responseData;
}

// ------------------------------------------------------------------
async function searchPosts(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//         post: search
	// ----------------------------------

	// https://www.reddit.com/dev/api/#GET_search

	const location = this.getNodeParameter('location', i);

	const qs = {
		q: this.getNodeParameter('keyword', i),
		restrict_sr: location === 'subreddit',
	} as IDataObject;

	// tslint:disable-next-line:no-any
	const { sort } = this.getNodeParameter('additionalFields', i) as any;

	if (sort) {
		qs.sort = sort;
	}

	let endpoint = '';

	if (location === 'allReddit') {
		endpoint = 'search.json';
	} else {
		const subreddit = this.getNodeParameter('subreddit', i);
		endpoint = `r/${subreddit}/search.json`;
	}

	let responseData = await handleListing.call(this, i, endpoint, qs);

	const returnAll = this.getNodeParameter('returnAll', 0);

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', 0);
		responseData = responseData.splice(0, limit);
	}
	return responseData;
}

// ------------------------------------------------------------------
async function createPostComment(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//        postComment: create
	// ----------------------------------

	// https://www.reddit.com/dev/api/#POST_api_comment

	const postTypePrefix = 't3_';

	const qs: IDataObject = {
		text: this.getNodeParameter('commentText', i),
		thing_id: postTypePrefix + this.getNodeParameter('postId', i),
	};

	let responseData = await redditApiRequest.call(this, 'POST', 'api/comment', qs);
	responseData = responseData.json.data.things[0].data;
	return responseData;
}

// ------------------------------------------------------------------
async function deletePostComment(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//        postComment: delete
	// ----------------------------------

	// https://www.reddit.com/dev/api/#POST_api_del

	const commentTypePrefix = 't1_';

	const qs: IDataObject = {
		id: commentTypePrefix + this.getNodeParameter('commentId', i),
	};

	await redditApiRequest.call(this, 'POST', 'api/del', qs);

	const responseData = { success: true };
	return responseData;
}

// ------------------------------------------------------------------
async function getAllPostComments(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//        postComment: getAll
	// ----------------------------------

	// https://www.reddit.com/r/{subrreddit}/comments/{postId}.json

	const subreddit = this.getNodeParameter('subreddit', i);
	const postId = this.getNodeParameter('postId', i) as string;
	const endpoint = `r/${subreddit}/comments/${postId}.json`;

	const responseData = await handleListing.call(this, i, endpoint);
	return responseData;
}

// ------------------------------------------------------------------
async function replyPostComment(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//        postComment: reply
	// ----------------------------------

	// https://www.reddit.com/dev/api/#POST_api_comment

	const commentTypePrefix = 't1_';

	const qs: IDataObject = {
		text: this.getNodeParameter('replyText', i),
		thing_id: commentTypePrefix + this.getNodeParameter('commentId', i),
	};

	let responseData = await redditApiRequest.call(this, 'POST', 'api/comment', qs);
	responseData = responseData.json.data.things[0].data;
	return responseData;
}

// ------------------------------------------------------------------
async function getProfile(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//         profile: get
	// ----------------------------------

	// https://www.reddit.com/dev/api/#GET_api_v1_me
	// https://www.reddit.com/dev/api/#GET_api_v1_me_karma
	// https://www.reddit.com/dev/api/#GET_api_v1_me_prefs
	// https://www.reddit.com/dev/api/#GET_api_v1_me_trophies
	// https://www.reddit.com/dev/api/#GET_prefs_{where}

	const endpoints: { [key: string]: string } = {
		identity: 'me',
		blockedUsers: 'me/blocked',
		friends: 'me/friends',
		karma: 'me/karma',
		prefs: 'me/prefs',
		trophies: 'me/trophies',
	};

	const details = this.getNodeParameter('details', i) as string;
	const endpoint = `api/v1/${endpoints[details]}`;
	let username;

	if (details === 'saved') {
		({ name: username } = await redditApiRequest.call(this, 'GET', `api/v1/me`, {}));
	}

	let responseData =
		details === 'saved'
			? await handleListing.call(this, i, `user/${username}/saved.json`)
			: await redditApiRequest.call(this, 'GET', endpoint, {});

	if (details === 'identity') {
		responseData = responseData.features;
	} else if (details === 'friends') {
		responseData = responseData.data.children;
		if (!responseData.length) {
			throw new NodeApiError(this.getNode(), responseData);
		}
	} else if (details === 'karma') {
		responseData = responseData.data;
		if (!responseData.length) {
			throw new NodeApiError(this.getNode(), responseData);
		}
	} else if (details === 'trophies') {
		responseData = responseData.data.trophies.map((trophy: IDataObject) => trophy.data);
	}
	return responseData;
}

// ------------------------------------------------------------------
async function getSubreddit(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//        subreddit: get
	// ----------------------------------

	// https://www.reddit.com/dev/api/#GET_r_{subreddit}_about
	// https://www.reddit.com/dev/api/#GET_r_{subreddit}_about_rules

	const subreddit = this.getNodeParameter('subreddit', i);
	const content = this.getNodeParameter('content', i) as string;
	const endpoint = `r/${subreddit}/about/${content}.json`;

	let responseData = await redditApiRequest.call(this, 'GET', endpoint, {});

	if (content === 'rules') {
		responseData = responseData.rules;
	} else if (content === 'about') {
		responseData = responseData.data;
	}
	return responseData;
}

// ------------------------------------------------------------------
async function getAllSubreddits(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//        subreddit: getAll
	// ----------------------------------

	// https://www.reddit.com/dev/api/#GET_api_trending_subreddits
	// https://www.reddit.com/dev/api/#POST_api_search_subreddits
	// https://www.reddit.com/r/subreddits.json

	// tslint:disable-next-line:no-any
	const filters = this.getNodeParameter('filters', i) as any;

	let responseData;
	if (filters.trending) {
		const returnAll = this.getNodeParameter('returnAll', 0);
		const endpoint = 'api/trending_subreddits.json';
		responseData = await redditApiRequest.call(this, 'GET', endpoint, {});
		responseData = responseData.subreddit_names.map((name: string) => ({ name }));
		if (returnAll === false) {
			const limit = this.getNodeParameter('limit', 0);
			responseData = responseData.splice(0, limit);
		}
	} else if (filters.keyword) {
		const qs: IDataObject = {};
		qs.query = filters.keyword;

		const endpoint = 'api/search_subreddits.json';
		responseData = await redditApiRequest.call(this, 'POST', endpoint, qs);

		const returnAll = this.getNodeParameter('returnAll', 0);

		if (returnAll === false) {
			const limit = this.getNodeParameter('limit', 0);
			responseData = responseData.subreddits.splice(0, limit);
		}
	} else {
		const endpoint = 'r/subreddits.json';
		responseData = await handleListing.call(this, i, endpoint);
	}
	return responseData;
}

// ------------------------------------------------------------------
async function getUser(this: IExecuteFunctions, items: INodeExecutionData[], i: number) {
	// ----------------------------------
	//           user: get
	// ----------------------------------

	// https://www.reddit.com/dev/api/#GET_user_{username}_{where}

	const username = this.getNodeParameter('username', i) as string;
	const details = this.getNodeParameter('details', i) as string;
	const endpoint = `user/${username}/${details}.json`;

	let responseData =
		details === 'about'
			? await redditApiRequest.call(this, 'GET', endpoint, {})
			: await handleListing.call(this, i, endpoint);

	if (details === 'about') {
		responseData = responseData.data;
	}

	return responseData;
}


/**
 * Make an authenticated or unauthenticated API request to Reddit.
 */
async function redditApiRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: string,
	endpoint: string,
	qs: IDataObject,
	// tslint:disable-next-line:no-any
): Promise<any> {
	const resource = this.getNodeParameter('resource', 0) as string;

	const authRequired = ['profile', 'post', 'postComment'].includes(resource);

	qs.api_type = 'json';

	const options: OptionsWithUri = {
		headers: {
			'user-agent': 'n8n',
		},
		method,
		uri: authRequired
			? `https://oauth.reddit.com/${endpoint}`
			: `https://www.reddit.com/${endpoint}`,
		qs,
		json: true,
	};

	if (!Object.keys(qs).length) {
		delete options.qs;
	}

	if (authRequired) {
		try {
			return await this.helpers.requestOAuth2.call(this, 'redditOAuth2Api', options);
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	} else {
		try {
			return await this.helpers.request.call(this, options);
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}
}

/**
 * Make an unauthenticated API request to Reddit and return all results.
 */
async function redditApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions,
	method: string,
	endpoint: string,
	qs: IDataObject,
	// tslint:disable-next-line:no-any
): Promise<any> {
	let responseData;
	const returnData: IDataObject[] = [];

	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;
	const returnAll = this.getNodeParameter('returnAll', 0, false) as boolean;

	qs.limit = 100;

	do {
		responseData = await redditApiRequest.call(this, method, endpoint, qs);
		if (!Array.isArray(responseData)) {
			qs.after = responseData.data.after;
		}

		if (endpoint === 'api/search_subreddits.json') {
			responseData.subreddits.forEach((child: any) => returnData.push(child)); // tslint:disable-line:no-any
		} else if (resource === 'postComment' && operation === 'getAll') {
			responseData[1].data.children.forEach((child: any) => returnData.push(child.data)); // tslint:disable-line:no-any
		} else {
			responseData.data.children.forEach((child: any) => returnData.push(child.data)); // tslint:disable-line:no-any
		}
		if (qs.limit && returnData.length >= qs.limit && returnAll === false) {
			return returnData;
		}
	} while (responseData.data && responseData.data.after);

	return returnData;
}

/**
 * Handles a large Reddit listing by returning all items or up to a limit.
 */
async function handleListing(
	this: IExecuteFunctions,
	i: number,
	endpoint: string,
	qs: IDataObject = {},
	requestMethod: 'GET' | 'POST' = 'GET',
	// tslint:disable-next-line:no-any
): Promise<any> {
	let responseData;

	const returnAll = this.getNodeParameter('returnAll', i);

	if (returnAll) {
		responseData = await redditApiRequestAllItems.call(this, requestMethod, endpoint, qs);
	} else {
		const limit = this.getNodeParameter('limit', i);
		qs.limit = limit;
		responseData = await redditApiRequestAllItems.call(this, requestMethod, endpoint, qs);
		responseData = responseData.slice(0, limit);
	}

	return responseData;
}

// tslint:disable-next-line:no-any
function getExecutionData(this: IExecuteFunctions, responseData: any, i: number): NodeExecutionWithMetadata[] {
	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);
}