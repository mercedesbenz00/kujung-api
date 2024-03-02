export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum UserStatus {
  WAITING_APPROVAL = 'waiting_approval',
  ACTIVE = 'active',
  IDLE = 'idle',
  WAITING_INACTIVE = 'waiting_inactive',
  INACTIVE = 'inactive',
}

export enum GeneralProcessStatus {
  WAITING_APPROVAL = 0,
  APPROVED = 1,
  REJECTED = 2,
}

export enum LikeEntityType {
  Notification = 'notification',
  ExpertHouse = 'expert_house',
  OnlineHouse = 'online_house',
  Portfolio = 'portfolio',
  SmartStore = 'smart_store',
  User = 'user',
}

export enum WishEntityType {
  ExpertHouse = 'expert_house',
  OnlineHouse = 'online_house',
  SmartStore = 'smart_store',
  Product = 'product',
}

export enum ViewLogEntityType {
  ExpertHouse = 'expert_house',
  OnlineHouse = 'online_house',
  Portfolio = 'portfolio',
  Product = 'product',
  Notification = 'notification',
}

export enum PointType {
  Direct = 'direct',
  Order = 'order',
  Account = 'account',
  OnlineHouse = 'online_house',
  ExpertHouse = 'expert_house',
}
