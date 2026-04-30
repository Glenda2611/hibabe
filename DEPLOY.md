# 🐍 SERPENTTE — GUIA DE DEPLOY NA VERCEL

## O que você tem nesta pasta

```
serpentte/
├── index.html       ← site completo com coleta de dados
├── api/
│   └── track.js     ← função serverless que recebe os dados
├── vercel.json      ← configuração do deploy
└── DEPLOY.md        ← este guia
```

---

## DADOS COLETADOS AUTOMATICAMENTE

| Dado | Como é coletado |
|------|----------------|
| **Nome e Email** | Modal de cadastro que aparece após 4s |
| **Cidade, País, IP** | API ipapi.co (sem pedir permissão) |
| **Dispositivo / Tela** | navigator APIs do browser |
| **Nodes clicados** | Cada clique é registrado com timestamp |
| **Tempo na página** | Medido em segundos até fechar a aba |

Todos os dados chegam nos **Logs da Vercel** em tempo real.

---

## PASSO A PASSO — DEPLOY NA VERCEL

### 1. Crie uma conta gratuita
→ Acesse https://vercel.com e crie uma conta (pode entrar com GitHub)

### 2. Suba os arquivos pelo dashboard (método mais fácil)
1. Clique em **"Add New Project"**
2. Escolha **"Deploy from template"** → ou arraste a pasta `serpentte/`
3. Se quiser via GitHub: suba a pasta como repositório primeiro

### 3. Via GitHub (recomendado para atualizar fácil)
```bash
# No terminal, dentro da pasta serpentte/:
git init
git add .
git commit -m "serpentte v1"
# Crie um repositório no github.com e conecte:
git remote add origin https://github.com/SEU_USER/serpentte.git
git push -u origin main
```
Depois conecte o repositório na Vercel — ela faz deploy automático.

### 4. Via Vercel CLI (mais técnico)
```bash
npm i -g vercel
cd serpentte/
vercel
# Siga as instruções no terminal
```

---

## ONDE VER OS DADOS

### Opção A — Logs da Vercel (zero configuração)
1. No dashboard da Vercel, clique no seu projeto
2. Vá em **"Logs"** → **"Functions"**
3. Cada visita aparece como linha `[SERPENTTE_TRACK] {...}`
4. Você vê: nome, email, cidade, nodes clicados, tempo na página

### Opção B — Receber os dados no Google Sheets (recomendado!)
Use o Make.com (gratuito) para conectar a API ao Sheets:

1. Crie uma conta em https://make.com
2. Crie um cenário: **Webhook → Google Sheets**
3. Copie a URL do webhook
4. No painel da Vercel → seu projeto → **Settings → Environment Variables**
5. Adicione: `WEBHOOK_URL` = URL do Make.com
6. Redeploy — cada visita vai aparecer numa linha do Sheets ✓

### Opção C — Vercel KV (banco de dados nativo)
1. No dashboard → **Storage → Create → KV**
2. Conecte ao projeto
3. Descomente as linhas do KV no `api/track.js`
4. Acesse os dados pelo dashboard da Vercel

---

## URL FINAL

Após o deploy, seu site estará em:
```
https://serpentte.vercel.app
```
(ou o nome que você escolher — pode comprar domínio próprio depois)

---

## DÚVIDAS?
Os dados de analytics aparecem nos logs imediatamente após cada visita.
Para ver em tempo real: Vercel Dashboard → Functions → Logs → ativar "Live"
