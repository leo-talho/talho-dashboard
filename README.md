# Talho Carnes KPI Dashboard

Painel financeiro seguro com autenticação de usuário, filtros de período e exportação de dados.

## Credenciais padrão (MVP)

- leo@talho.com.br → talho2026
- mauricio@talho.com.br → talho2026
- sergio@talho.com.br → talho2026

**⚠️ Importante:** Altere as senhas e atualize em `pages/index.js` antes de ir para produção.

---

## Deploy no Vercel (Passo a passo)

### Pré-requisitos
- Conta no GitHub (grátis: github.com/signup)
- Conta no Vercel (grátis, integra com GitHub: vercel.com)

### Etapa 1: Criar repositório no GitHub

1. Acesse **github.com** e faça login
2. Clique no **+** no canto superior direito → **New repository**
3. Nome: `talho-dashboard`
4. Descrição: "Talho Carnes KPI Dashboard"
5. ☑️ Marque **Public** (ou Private se preferir, Vercel funciona com ambos)
6. **Create repository**

### Etapa 2: Upload dos arquivos para GitHub

**Opção A: Via GitHub Web (mais fácil)**

1. No seu novo repositório, clique em **Add file** → **Upload files**
2. Arraste os arquivos deste projeto para a caixa:
   - `package.json`
   - `next.config.js`
   - `.gitignore`
   - `README.md`
   - Pasta `pages/` com `index.js`
3. Clique em **Commit changes**

**Opção B: Via Git (se souber usar terminal)**

```bash
cd ~/Desktop/talho-dashboard
git init
git add .
git commit -m "Initial commit: Talho KPI Dashboard"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/talho-dashboard.git
git push -u origin main
```

### Etapa 3: Deploy no Vercel

1. Acesse **vercel.com**
2. Clique em **Sign Up** (ou **Log in** se já tem conta)
3. Escolha **Continue with GitHub**
4. Autorize Vercel a acessar seu GitHub
5. Clique em **New Project**
6. Procure por `talho-dashboard` e clique em **Import**
7. Vercel auto-detecta que é Next.js
8. Clique em **Deploy**

✅ **Pronto!** Seu dashboard está ao vivo em: `https://talho-dashboard.vercel.app`

---

## Atualizar dados mensalmente

### Quando atualizar?
- Data: 5º do mês (quando os dados chegam em Analytics.xlsx)
- Horário: até 17h30 (para board ver de manhã no dia 6)

### Como atualizar?

1. **Extrair dados do Analytics.xlsx:**
   - Abra o arquivo em Excel/Google Sheets
   - Abra a aba `KPI's Dashboard`
   - Copie os valores de **YTD 2026** e **YTD 2025** (coluna B e C)

2. **Editar o código:**
   - Acesse GitHub → seu repo `talho-dashboard`
   - Abra o arquivo `pages/index.js`
   - Clique no lápis (✏️) para editar
   - Encontre a seção `const kpiData = {` (linha ~24)
   - Atualize os valores em `YTD:`
   - Role até a seção `caixaData` e atualize com os dados da aba `CAIXA`

3. **Salvar e fazer deploy:**
   - Scroll para baixo
   - Clique em **Commit changes** (com mensagem: "Update KPIs - Sep 2026" por exemplo)
   - Vercel auto-redeploy em 1-2 minutos

4. **Testar:**
   - Espere a notificação "Deployment successful" no email
   - Acesse `https://talho-dashboard.vercel.app`
   - Faça login e verifique se os números estão corretos

---

## Mudar senhas

1. GitHub → `talho-dashboard` → `pages/index.js` → editar
2. Procure por `const validUsers = {`
3. Mude os valores:
   ```javascript
   'leo@talho.com.br': 'NOVA_SENHA_LEO',
   'mauricio@talho.com.br': 'NOVA_SENHA_MAURICIO',
   'sergio@talho.com.br': 'NOVA_SENHA_SERGIO',
   ```
4. **Commit changes**
5. Comunique as novas senhas ao time (via WhatsApp/email seguro, não no GitHub)

---

## Troubleshooting

**"Deployment failed"**
- Verifique se todos os arquivos foram enviados (especialmente `package.json` e `pages/`)
- Vercel mostra o erro na aba "Deployments" → clique no deployment falho

**"Página não carrega"**
- Limpe o cache do navegador (Cmd+Shift+R no Mac, Ctrl+Shift+R no Windows)
- Espere 2 minutos (pode estar fazendo deploy)

**"Senhas não funcionam"**
- Verifique se commitou as mudanças no GitHub
- Aguarde o redeploy automático (1-2 min)

**Precisa de suporte?**
- Documente o erro e envie screenshot para leo@talho.com.br

---

## Estrutura de arquivos

```
talho-dashboard/
├── pages/
│   └── index.js          ← Dashboard principal (EDITE AQUI para dados)
├── package.json          ← Dependências
├── next.config.js        ← Config do Next.js
├── .gitignore            ← Arquivos ignorados pelo Git
├── vercel.json           ← Config Vercel (opcional)
└── README.md             ← Este arquivo
```

---

## Próximas melhorias (Phase 2)

- [ ] API para atualizar dados automaticamente
- [ ] Integração com Google Sheets
- [ ] Gráficos de tendência
- [ ] RFM e análise de clientes
- [ ] Alerts para KPIs críticos
- [ ] Dark mode
- [ ] Mobile app

---

**Última atualização:** September 2026
**Status:** ✅ Live
