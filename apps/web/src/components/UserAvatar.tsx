interface UserAvatarProps {
  name: string;
  className?: string;
  size?: number;
}

export const UserAvatar = ({
  name,
  className = "size-10",
  size = 64,
}: UserAvatarProps) => {
  const seed = encodeURIComponent(name);

  const avatarUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}&size=${size}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    <div
      className={`overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm ${className}`}
    >
      <img
        src={avatarUrl}
        alt={`Avatar de ${name}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};
