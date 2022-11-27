import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { properties } from './ETReddit_Properties';
import { methods } from './ETReddit_Methods';

export class ETReddit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ETReddit',
		name: 'et-reddit',
		icon: 'file:ETReddit.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the Reddit API',
		defaults: {
			name: 'Reddit',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'redditOAuth2Api',
				required: false,
			},
		],
		properties: [
			properties.resources,
			...properties.postComment.operations,
			...properties.postComment.fields,
			...properties.profile.operations,
			...properties.profile.fields,
			...properties.subreddit.operations,
			...properties.subreddit.fields,
			...properties.post.operations,
			...properties.post.fields,
			...properties.user.operations,
			...properties.user.fields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < items.length; i++) {
			const executionData = await methods.execute.call(this, items, i);
			returnData.push(...executionData);
		}
		return this.prepareOutputData(returnData);
	}
}