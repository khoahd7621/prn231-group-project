import { Avatar, AvatarProps } from "antd";

import { Gender } from "../../../constants/enum";

type Props = {
  gender: Gender;
} & AvatarProps;

export function RenderAvatar({ gender, ...props }: Props) {
  switch (Gender[gender.toString() as keyof typeof Gender]) {
    case Gender.Male:
      return (
        <Avatar
          src="https://static.vecteezy.com/system/resources/thumbnails/004/511/281/small/default-avatar-photo-placeholder-profile-picture-vector.jpg"
          {...props}
        />
      );
    case Gender.Female:
      return (
        <Avatar
          src="https://static.vecteezy.com/system/resources/previews/002/596/484/original/default-avatar-photo-placeholder-profile-image-female-vector.jpg"
          {...props}
        />
      );
    default:
      return (
        <Avatar
          src="https://static.vecteezy.com/system/resources/previews/005/129/844/original/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
          {...props}
        />
      );
  }
}
