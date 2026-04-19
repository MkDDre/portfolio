interface Pizza {
  id: number;
  title: string;
  content: string;
}

type NewPizza = Omit<Pizza, 'id'>;

interface Drink {
  title: string;
  image: string;
  volume: string;
  price: string;
}

interface PizzeriaContext {
  pizzas: Pizza[];
  setPizzas: (pizzas: Pizza[]) => void;
  actionToBePerformed: boolean;
  setActionToBePerformed: (actionToBePerformed: boolean) => void;
  clearActionToBePerformed: () => void;
  drinks: Drink[];
  addPizza: (newPizza: NewPizza) => Promise<void>;
}

type ServiceStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';

interface ServiceAuthor {
  id?: number;
  email: string;
}

interface ServiceDto {
  id: number;
  author?: ServiceAuthor;
  serviceTitle: string;
  price: number;
  status: ServiceStatus;
}

interface CartLine {
  serviceId: number;
  serviceTitle: string;
  price: number;
}

interface CreateReservationLineRequestDto {
  serviceId: number;
  date?: string;
}

interface CreateReservationRequestDto {
  reservationDate: string;
  lines: CreateReservationLineRequestDto[];
}

type ReservationStatus = 'FUTUR' | 'CANCELED';

interface ReservationDto {
  id: number;
  reservationDate: string;
  total_price: number;
  status: ReservationStatus;
}

interface CartContextType {
  lines: CartLine[];
  totalPrice: number;
  addLine: (service: ServiceDto) => void;
  removeLine: (serviceId: number) => void;
  clearCart: () => void;
}

interface AuthContextType {
  authenticatedUser: MaybeAuthenticatedUser;
  isAuthenticated: boolean;
  registerUser: (newUser: RegisterRequestDto) => Promise<void>;
  loginUser: (credentials: AuthRequestDto) => Promise<void>;
  clearUser: () => void;
}

type UserRole = 'ADMIN' | 'CUSTOMER' | 'SERVICE_PROVIDER';

interface AuthRequestDto {
  email: string;
  password: string;
}

type RegisterRequestDto = AuthRequestDto;

interface AuthResponseDto {
  email: string;
  token: string;
  role: UserRole;
}

type MaybeAuthenticatedUser = AuthResponseDto | undefined;

type UserContextType = AuthContextType;
type User = AuthRequestDto;
type AuthenticatedUser = AuthResponseDto;

export type {
  Pizza,
  NewPizza,
  Drink,
  PizzeriaContext,
  ServiceStatus,
  ServiceAuthor,
  ServiceDto,
  CartLine,
  CreateReservationLineRequestDto,
  CreateReservationRequestDto,
  ReservationStatus,
  ReservationDto,
  CartContextType,
  UserRole,
  AuthRequestDto,
  RegisterRequestDto,
  AuthResponseDto,
  MaybeAuthenticatedUser,
  AuthContextType,
  UserContextType,
  User,
  AuthenticatedUser,
};
