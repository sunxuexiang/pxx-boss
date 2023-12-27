export default __ENVINFO__ as RootObject;

export interface GoodsState {
  0: string;
  1: string;
  2: string;
  3: string;
}

export interface ReturnGoodsState {
  INIT: string;
  AUDIT: string;
  DELIVERED: string;
  RECEIVED: string;
  COMPLETED: string;
  REJECT_RECEIVE: string;
  REJECT_REFUND: string;
  VOID: string;
  REFUND_FAILED: string;
}

export interface ReturnMoneyState {
  INIT: string;
  AUDIT: string;
  COMPLETED: string;
  REJECT_REFUND: string;
  VOID: string;
  REFUND_FAILED: string;
}

export interface RefundStatus {
  0: string;
  1: string;
  2: string;
  3: string;
}

export interface PayType {
  0: string;
  1: string;
}

export interface PriceType {
  0: string;
  1: string;
  2: string;
}

export interface Platform {
  BOSS: string;
  MERCHANT: string;
  THIRD: string;
  CUSTOMER: string;
}

export interface DeliverStatus {
  NOT_YET_SHIPPED: string;
  SHIPPED: string;
  PART_SHIPPED: string;
  VOID: string;
}

export interface PayState {
  NOT_PAID: string;
  PARTIAL_PAID: string;
  PAID: string;
}

export interface FlowState {
  INIT: string;
  REMEDY: string;
  REFUND: string;
  AUDIT: string;
  DELIVERED_PART: string;
  DELIVERED: string;
  CONFIRMED: string;
  COMPLETED: string;
  VOID: string;
  REFUND_FAILED: string;
}

export interface CouponScopeType {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
}

export interface CouponStatus {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
}

export interface ActivityStatus {
  1: string;
  2: string;
  3: string;
  4: string;
}

export interface CouponActivityType {
  0: string;
  1: string;
  2: string;
  3: string;
  9: string;
  12: string;
}

export interface petGender {
  0: string;
  1: string;
}

export interface petLength {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
}

export interface petType {
  0: string;
  1: string;
  2: string;
}

export interface petWoolLength {
  0: string;
  1: string;
}

export interface FileSize {
  TWO: number;
}

export interface RootObject {
  payWay: any;
  X_XITE_OPEN_HOST: any;
  COPY_VERSION: string;
  HTTP_TIME_OUT: number;
  DAY_FORMAT: string;
  HOST: string;
  DATE_FORMAT_HOUR: string;
  DATE_FORMAT: string;
  TIME_FORMAT: string;
  DATE_FORMAT_SECOND: string;
  SUCCESS_CODE: string;
  goodsState: GoodsState;
  returnGoodsState: ReturnGoodsState;
  returnMoneyState: ReturnMoneyState;
  refundStatus: RefundStatus;
  payType: PayType;
  priceType: PriceType;
  platform: Platform;
  deliverStatus: DeliverStatus;
  payState: PayState;
  flowState: FlowState;
  couponScopeType: CouponScopeType;
  couponStatus: CouponStatus;
  activityStatus: ActivityStatus;
  couponActivityType: CouponActivityType;
  petGender: petGender;
  petLength: petLength;
  petType: petType;
  petWoolLength: petWoolLength;
  platformDefaultId: number;
  fileSize: FileSize;
  spuMaxSku: number;
  systemAuth: boolean;
  IM_URL: string;
}
