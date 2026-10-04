import { useMutation } from "@tanstack/react-query"
import { withMock } from "../use-mock"
import { validateVoucherApi } from "./voucher.api"
import type { ApplyVoucherResponse } from "../types"

const mockValidate: ApplyVoucherResponse = {
  voucherCode: "WELCOME10",
  discountPercent: 10,
  discountAmount: 150000,
  amountCap: 200000,
  message: "Voucher applied! You save 1,500.00.",
}

export function useValidateVoucher() {
  return useMutation({
    mutationFn: (args: { voucherCode: string; cartSubtotal: number }) =>
      withMock(mockValidate, () => validateVoucherApi({ voucherCode: args.voucherCode }, args.cartSubtotal)),
  })
}
