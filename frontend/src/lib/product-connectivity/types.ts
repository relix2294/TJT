/** Product funnel step kinds — every major page should guide toward these destinations. */
export type ProductStepKind =
  | "compare"
  | "trust"
  | "protocol"
  | "opportunity"
  | "safety"
  | "learn"
  | "review";

export type ProductNextStepAction = {
  kind: ProductStepKind;
  label: string;
  href: string;
  description?: string;
};
