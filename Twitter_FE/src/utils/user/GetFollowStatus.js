export default function getFollowStatus(authUser, targetUser) {
  if (!authUser || !targetUser) return null;

  const isFollowing = authUser.following.includes(targetUser._id);
  const isFollower = authUser.followers.includes(targetUser._id);

  if (isFollowing) {
    return "unfollow"; // mình đã follow người ta rồi
  }

  if (!isFollowing && isFollower) {
    return "followback"; // người ta follow mình nhưng mình chưa follow lại
  }

  return "follow"; // chưa ai follow ai
}
