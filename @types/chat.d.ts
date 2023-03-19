declare namespace Chat {
  interface Chat {
    dateTime: string
    text: string
    inversion?: boolean
    error?: boolean
    loading?: boolean
    conversationOptions?: ConversationRequest | null
    requestOptions: { prompt: string; options?: ConversationRequest | null }
  }

  interface History {
    title: string
    isEdit: boolean
    id: number
  }

  interface ChatState {
    active: number | null
    history: History[]
    chat: { id: number; data: Chat[] }[]
  }

  interface ConversationRequest {
    conversationId?: string
    parentMessageId?: string
  }

  interface ConversationResponse {
    conversationId: string
    detail: {
      choices: {
        finish_reason: string
        index: number
        logprobs: any
        text: string
      }[]
      created: number
      id: string
      model: string
      object: string
      usage: {
        completion_tokens: number
        prompt_tokens: number
        total_tokens: number
      }
    }
    id: string
    parentMessageId: string
    role: string
    text: string
  }
}
