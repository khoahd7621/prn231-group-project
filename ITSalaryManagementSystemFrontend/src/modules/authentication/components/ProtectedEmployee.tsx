import { Navigate } from "react-router-dom";

import { Role } from "../../../constants/enum";
import { useAppSelector } from "../../../reduxs/hooks";

type Props = {
  children: React.ReactNode;
};

export function ProtectedEmployee({ children }: Props) {
  const authState = useAppSelector((state) => state.auth);
  const profileState = useAppSelector((state) => state.profile);

  if (!authState.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (profileState.loading) {
    return <div>Loading ...</div>;
  }

  if (profileState.user.role === Role.Admin) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
}
