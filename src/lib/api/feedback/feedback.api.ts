import client from "../client"

export interface SubmitFeedbackDto {
  name?: string | null
  email?: string | null
  message: string
}

export async function submitFeedbackApi(body: SubmitFeedbackDto): Promise<void> {
  await client.post("/api/v1/Feedback", body, { skipSuccessToast: true })
}
