import client from "../client"
import type { ApplyVoucherRequest, ApplyVoucherResponse } from "../types"

export async function validateVoucherApi(
  body: ApplyVoucherRequest,
  cartSubtotal: number,
): Promise<ApplyVoucherResponse> {
  const { data } = await client.post("/api/v1/voucher/validate", body, {
    params: { subtotal: cartSubtotal },
    skipSuccessToast: true,
  })
  return data as ApplyVoucherResponse
}
