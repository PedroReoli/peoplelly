import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();

  // Verifica se há posts antes de renderizar
  if (!posts || posts.length === 0) {
    return <p className="text-white text-center mt-4">Nenhum post encontrado.</p>;
  }

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        post && post.imageUrl ? (
          <li key={post.$id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
              <img
                src={post.imageUrl}
                alt="post"
                className="h-full w-full object-cover rounded-md"
              />
            </Link>

            <div className="grid-post_user p-2 bg-gray-900/80 backdrop-blur-sm rounded-md flex justify-between items-center">
              {showUser && post.creator && (
                <div className="flex items-center gap-2">
                  <img
                    src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="creator"
                    className="w-8 h-8 rounded-full border border-gray-700"
                  />
                  <p className="text-white text-sm font-medium line-clamp-1">{post.creator.name}</p>
                </div>
              )}
              {showStats && post && <PostStats post={post} userId={user?.id} />}
            </div>
          </li>
        ) : null
      ))}
    </ul>
  );
};

export default GridPostList;
