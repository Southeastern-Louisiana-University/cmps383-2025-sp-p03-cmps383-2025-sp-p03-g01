import { ReviewDto, CreateReviewDto, UpdateReviewDto } from "../Data/ReviewInterface";

export const reviewService = {
  async getAll(): Promise<ReviewDto[]> {
    const res = await fetch("/api/reviews");
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  },

  async getById(id: number): Promise<ReviewDto> {
    const res = await fetch(`/api/reviews/${id}`);
    if (!res.ok) throw new Error("Review not found");
    return res.json();
  },

  async create(dto: CreateReviewDto): Promise<ReviewDto> {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Failed to create review");
    return res.json();
  },

  async update(id: number, dto: UpdateReviewDto): Promise<UpdateReviewDto> {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Failed to update review");
    return res.json();
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete review");
  },
};
