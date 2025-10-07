import { Navigate } from "react-router-dom";

function RotaProtegida({ tipoNecessario, children }) {
  const token = localStorage.getItem("token");
  const userType = Number(localStorage.getItem("user_type"));

  // não autenticado → volta para landing (onde estão os modais)
  if (!token) return <Navigate to="/" replace />;

  // autenticado mas tipo diferente → sem permissão
  if (tipoNecessario && userType !== tipoNecessario) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaProtegida;
