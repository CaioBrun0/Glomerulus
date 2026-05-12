# 🔬 PathoSpotter - Classificação de Biópsias Renais (Frontend)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

Interface web responsiva e otimizada desenvolvida para o **Sistema de Classificação de Imagens de Biópsias Renais (Glomerulopatias Crescenticas)**. 

Este projeto faz parte de uma iniciativa de Iniciação Científica vinculada ao **Centro de Pesquisas Gonçalo Muniz (CpqGM/FIOCRUZ)**, atuando como uma camada de inteligência e anotação perfeitamente integrada ao ecossistema do **PathoSpotter** e Nextcloud.

---

## ✨ Funcionalidades

- **Autenticação Segura:** Login baseado em tokens JWT com controle de acesso para usuários comuns e administradores.
- **Visualização Otimizada:** Interface sob demanda para visualização de imagens médicas de alta resolução via WebDAV, sem sobrecarregar a memória do navegador.
- **Classificação Dinâmica:** Formulários de classificação de biópsias (incluindo suporte a múltipla escolha e metadados customizados).
- **Gestão de Ambientes:** Painel administrativo para importação, criação e distribuição de conjuntos de imagens (ambientes de classificação).
- **Conteinerização Pronta:** Estrutura Multi-stage build (Node.js + Nginx) pronta para implantação em servidores institucionais.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** React.js / JavaScript
- **Roteamento:** React Router DOM
- **Integração de API:** Axios (Comunicação com o Backend em FastAPI)
- **Deploy e Infraestrutura:** Docker, Docker Compose e Nginx

---

