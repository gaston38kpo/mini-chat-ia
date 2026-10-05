/**
 * @typedef {Object} ChatModel
 * @property {string} key
 * @property {string} displayName
 * @property {Array<Object>} loadedInstances
 */

/**
 * @typedef {Object} StreamMessageParams
 * @property {string} model
 * @property {string} input
 * @property {Array<{role: string, content: string}>} messages
 * @property {string|null} conversationId
 * @property {(token: string) => void} onToken
 */

/**
 * @typedef {Object} ChatProvider
 * @property {{ canManageModels: boolean }} capabilities
 * @property {() => Promise<ChatModel[]>} listModels
 * @property {(modelKey: string) => Promise<{instanceId: string}>} loadModel
 * @property {(instanceId: string) => Promise<void>} unloadModel
 * @property {(params: StreamMessageParams) => Promise<{conversationId: string|null}>} streamMessage
 */
