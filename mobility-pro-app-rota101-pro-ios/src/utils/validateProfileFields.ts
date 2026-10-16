const DEFAULT_PROFILE_IMAGE = 'user.png';

export const hasDefaultProfilePhoto = (user: any): boolean => {
  return (
    user?.profileImageLink?.split('/')?.pop() === DEFAULT_PROFILE_IMAGE ||
    user?.profileImage?.split('/')?.pop() === DEFAULT_PROFILE_IMAGE
  );
};

export const validateUserData = (userData: any, user: any): boolean => {
  return (
    !userData?.document ||
    !user?.profileImage ||
    !userData?.dateOfBirth ||
    hasDefaultProfilePhoto(user)
  );
};
