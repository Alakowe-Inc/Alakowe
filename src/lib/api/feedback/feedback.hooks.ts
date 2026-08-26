import { useMutation } from "@tanstack/react-query"
import { submitFeedbackApi, type SubmitFeedbackDto } from "./feedback.api"

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: (body: SubmitFeedbackDto) => submitFeedbackApi(body),
  })
}
