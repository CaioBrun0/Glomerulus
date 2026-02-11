import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { toast } from 'react-toastify';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/admins/dashboard-stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });

        if (response.ok) {
            const result = await response.json();
            setData(result);
        } else {
            throw new Error("Erro ao buscar dados");
        }
      } catch (err) {
        console.error("Erro dashboard:", err);
        // Fallback seguro para não quebrar a tela se a API falhar
        setData({
            total_especialistas: 0,
            total_admins: 0,
            total_greenlist: 0,
            total_ambientes: 0,
            usuarios_por_ambiente: []
        });
        toast.error("Não foi possível carregar os dados atualizados.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_BASE]);

  return (
    <div className="dashboard-container">
        
        {/* HEADER */}
        <header className="dashboard-header-page">
            <div className="header-left">
                <button className="btn-back-dash" onClick={() => navigate("/HomePageAdmin")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                    Voltar
                </button>
                <h1>Dashboard Analítico</h1>
            </div>
        </header>

        <main className="dashboard-content-page">
            {loading ? (
                <div className="loading-state">
                    <div className="spinner-dash"></div>
                    <p>Carregando métricas...</p>
                </div>
            ) : (
                <>
                    {/* 1. KPIs - CARDS DE TOTALIZADORES */}
                    <div className="kpi-section">
                        
                        {/* Especialistas */}
                        <div className="kpi-box purple">
                            <h3>{data.total_especialistas}</h3>
                            <p>Especialistas</p>
                            <small>Cadastrados</small>
                        </div>

                        {/* Admins */}
                        <div className="kpi-box pink">
                            <h3>{data.total_admins}</h3>
                            <p>Administradores</p>
                            <small>Cadastrados</small>
                        </div>

                        {/* Greenlist */}
                        <div className="kpi-box green">
                            <h3>{data.total_greenlist}</h3>
                            <p>Greenlist</p>
                            <small>Emails Autorizados</small>
                        </div>

                        {/* Ambientes */}
                        <div className="kpi-box dark">
                            <h3>{data.total_ambientes}</h3>
                            <p>Ambientes</p>
                            <small>Total Criado</small>
                        </div>
                    </div>

                    {/* 2. GRÁFICO ÚNICO: PESSOAS POR AMBIENTE */}
                    <div className="charts-section-single">
                        <div className="chart-card full-width">
                            <div className="chart-header">
                                <h4>Usuários por Ambiente</h4>
                                <p>Quantidade de especialistas vinculados a cada ambiente de rotulação.</p>
                            </div>
                            <div className="chart-body">
                                {data.usuarios_por_ambiente.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={data.usuarios_por_ambiente} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="nome" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{fill: '#888', fontSize: 13}} 
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                allowDecimals={false} 
                                            />
                                            <Tooltip 
                                                cursor={{fill: '#f9f9f9'}} 
                                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                                            />
                                            <Bar dataKey="qtd" name="Usuários" fill="#6C63FF" radius={[6, 6, 0, 0]} barSize={60}>
                                                 {
                                                    data.usuarios_por_ambiente.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6C63FF' : '#8577ff'} />
                                                    ))
                                                }
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="no-data-chart">
                                        Nenhum ambiente com usuários vinculados no momento.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    </div>
  );
}

export default DashboardPage;