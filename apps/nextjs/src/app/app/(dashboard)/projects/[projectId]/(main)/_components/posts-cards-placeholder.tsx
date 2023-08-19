import { PostCardPlaceholder } from "./post-card-placeholder";

export function PostsCardsPlaceholder() {
  return (
    <ul className="grid grid-cols-1 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <PostCardPlaceholder key={index} />
      ))}
    </ul>
  );
}
