import {OrderItemDto} from "./order-item.dto";

export interface CreateOrderRequestDto {
  customerId: string;
  items: OrderItemDto[];
}

