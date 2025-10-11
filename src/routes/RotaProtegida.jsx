import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * RotaProtegida agora valida o token com o backend (/usuarios/).
 * - Se localStorage.token existir, envia Authorization: Bearer <token>.
 * - Caso contrário, tenta enviar cookies com credentials: 'include' (suporte HttpOnly).
 * - Durante a verificação exibe nada (poder trocar por spinner).
 * - Se inválido ou tipo diferente, redireciona para "/".
 */
function RotaProtegida({ tipoNecessario, children }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  // ...existing code...
  // changed code: validação contra backend usando apenas cookie HttpOnly (credentials: 'include')
  useEffect(() => {
    let mounted = true;

    async function verify() {
      setChecking(true);
      try {
        // usa cookie HttpOnly para autenticar
        const resp = await fetch("http://localhost:8000/usuarios/", {
          method: "GET",
          credentials: "include"
        });

        if (!mounted) return;

        if (!resp.ok) {
          // não autenticado
          localStorage.removeItem("user_type");
          setAuthorized(false);
        } else {
            const data = await resp.json();
            let userType = null; // Inicializa como nulo

            // 1. Verifica se a resposta é um array e se tem pelo menos um usuário
            if (Array.isArray(data) && data.length > 0) {
                const userData = data[0]; // 2. Pega o primeiro objeto do array

                // 3. Converte a string "admin" ou "convencional" para o número esperado
                if (userData.tipo === "admin") {
                    userType = 2;
                } else if (userData.tipo === "convencional") { // Assumindo que o outro tipo se chama 'convencional'
                    userType = 1;
                }
            }

            // Apenas atualiza o localStorage se um tipo válido foi encontrado
            if (userType !== null) {
                localStorage.setItem("user_type", String(userType));
            }

            // 4. Faz a verificação final para autorizar ou não a rota
            if (tipoNecessario && userType === tipoNecessario) {
                setAuthorized(true);
            } else {
                setAuthorized(false);
            }
        }

      } catch (err) {
        console.warn("RotaProtegida: erro ao validar /usuarios/", err);
        localStorage.removeItem("user_type");
        setAuthorized(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    verify();
    return () => {
      mounted = false;
    };
  }, [tipoNecessario]);

// ...existing code...

  // enquanto verifica, não renderiza (substitua por um loader se quiser)
  if (checking) return null;

  if (!authorized) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export default RotaProtegida;