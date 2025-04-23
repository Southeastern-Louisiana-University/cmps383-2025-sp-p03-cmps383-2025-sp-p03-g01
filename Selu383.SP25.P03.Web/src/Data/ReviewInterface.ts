export interface UserDto {
  id: number;
  userName: string;
}

export interface TheaterDto {
  id: number;
  name: string;
  address: string;
}

export interface ReviewDto {
  id: number;
  review: string;
  rating: number;
  user: UserDto;
  theater: TheaterDto;
}

export interface CreateReviewDto {
  review: string;
  rating: number;
  userId: number;
  theaterId: number;
}

export interface UpdateReviewDto {
  review: string;
  rating: number;
}
