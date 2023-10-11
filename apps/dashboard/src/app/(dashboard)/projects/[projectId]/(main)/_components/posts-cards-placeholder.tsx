import { PostCardPlaceholder } from "./post-card-placeholder";

export function PostsCardsPlaceholder() {
  return (
    <div className="col-span-1 auto-rows-min grid-cols-1 lg:col-span-5">
      <ul className="grid min-h-[66.5vh] auto-rows-min gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostCardPlaceholder key={index} />
        ))}
      </ul>
    </div>
  );
}
