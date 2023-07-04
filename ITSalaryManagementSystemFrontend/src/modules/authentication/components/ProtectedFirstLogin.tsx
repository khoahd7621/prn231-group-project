import { ChangeFirstPassword } from ".";
import { useAppSelector } from "../../../reduxs/hooks";

type Props = {
  children: React.ReactNode;
};

export function ProtectedFirstLogin({ children }: Props) {
  const profileState = useAppSelector((state) => state.profile);

  if (profileState.loading) {
    return <div>Loading ...</div>;
  }

  if (profileState.user.isFirstLogin) {
    return <ChangeFirstPassword />;
  }

  return <>{children}</>;
}
