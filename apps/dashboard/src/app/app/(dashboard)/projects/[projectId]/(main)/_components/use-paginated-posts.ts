"use client";

import { useEffect, useState } from "react";

import type { GetPosts } from "~/app/_api/posts";
import { getPosts } from "~/app/_api/posts";

interface PaginatedPostsProps {
  page: number;
  pageSize: number;
}

type UsePaginatedPostsReturn = GetPosts & {
  loading: boolean;
};

export function usePaginatedPosts(
  projectId: string,
  filter: string,
  pagination: PaginatedPostsProps,
): UsePaginatedPostsReturn {
  const [loading, setLoading] = useState(true);
  const [paginatedPosts, setPaginatedPosts] = useState<GetPosts>({
    data: [],
    count: 0,
  });

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const paginatedPosts = await getPosts(projectId, filter, pagination);
      setPaginatedPosts(paginatedPosts);
      setLoading(false);
    };

    void loadPosts();
  }, [projectId, filter, pagination]);

  return {
    ...paginatedPosts,
    loading,
  };
}
